import {MyDB} from "./db";
import {SettingsCallback} from "247-core/dist/interfaces/callbacks";
import {
    PacketCheckIn,
    PacketRegister,
    PacketResponse,
    PacketSearchUsers,
    PacketSettings,
    User
} from "247-core/dist/interfaces/packets";
import {MyEvents} from "247-core/dist/events";
import {Gathering} from "./interfaces";
import SocketIOStatic = require("socket.io");
import * as jwt from 'jsonwebtoken';

let config = require('./config.json');

export class DataSync {

    constructor(private database: MyDB) {
    }

    public jwtEncode(data: any): any {
        return jwt.sign({
            data: data
        }, config['jwt-secret'], {expiresIn: config['jwt-expires']});
    }

    public jwtDecode(encoded: any): any {
        try {
            return jwt.verify(encoded, config['jwt-secret']);
        } catch (err) {
            return {err: err};
        }
    }

    public addSocket(socket: SocketIOStatic.Socket): void {
        socket.on(MyEvents.fetchSettings, (callback: SettingsCallback) => {
            this.getAllSettings(callback);
        });

        socket.on(MyEvents.registerUser, (regInfo: PacketRegister, callback: (resp: PacketResponse) => void) => {
            this.registerUser(regInfo, callback);
        });

        socket.on(MyEvents.searchUsers, (packet: PacketSearchUsers, callback: (users: User[]) => void) => {
            this.searchUsers(packet, callback);
        });

        socket.on(MyEvents.checkInUser, (packet: PacketCheckIn, callback: (resp: PacketResponse) => void) => {
            this.checkInUser(packet, callback);
        });

        this.adminEvents(socket);
    }

    private getAllSettings(callback: SettingsCallback) {
        let proms = [];

        proms.push(new Promise(resolve => {
            this.database.getGreekOpts(resolve);
        }));
        proms.push(new Promise(resolve => {
            this.database.getMinistryOpts(resolve);
        }));
        proms.push(new Promise(resolve => {
            this.database.getHowHearOpts(resolve);
        }));

        Promise.all(proms).then(data => {
            let settings: PacketSettings = {
                greekOpts: data[0],
                ministryOpts: data[1],
                hearOpts: data[2]
            };

            callback(settings);
        });
    }

    private registerUser(regInfo: PacketRegister, callback: (resp: PacketResponse) => void) {
        //Verify info
        let keys = Object.keys(regInfo);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].endsWith("Other")) continue;

            let val = regInfo[keys[i]];

            if (!isNaN(parseInt(val))) continue;
            if (val.length == 0) return;
        }

        this.database.registerUser(regInfo.firstName, regInfo.lastName, regInfo.email,
            regInfo.phone, regInfo.howhear, regInfo.howhearOther, regInfo.greek,
            regInfo.greekOther, regInfo.ministry, regInfo.ministryOther, userID => {
                this.checkInUser({userID: userID}, callback);
            });
    }

    private searchUsers(packet: PacketSearchUsers, callback: (users: User[]) => void) {
        this.database.getMostRecentGathering((gathering: Gathering) => {
            this.database.getCheckIns(gathering.id, (ids: number[]) => {
                this.database.searchUsers(packet.query, (users: User[]) => {
                    users.forEach(user => {
                        user.checkedIn = ids.indexOf(user.id) >= 0;
                    });

                    //TODO fix this logic
                    if (users.length == 0) {
                        callback([]);
                    } else {
                        callback([users[0]]);
                    }
                });
            });
        });
    }

    private checkInUser(packet: PacketCheckIn, callback: (resp: PacketResponse) => void) {
        //TODO also fix this logic
        this.database.getMostRecentGathering((gathering: Gathering) => {
            this.database.createCheckIn(gathering.id, packet.userID, () => {
                callback({success: true});
            });
        });
    }

    private adminEvents(socket: SocketIOStatic.Socket) {
        socket.on(MyEvents.adminVerify, (token: string, callback: (loggedIn: boolean) => void) => {
            let decoded = this.jwtDecode(token);

            if (!!decoded.err) {
                callback(false);
            } else {
                callback(!!decoded.data && !!decoded.data.loggedIn);
            }
        });

        socket.on(MyEvents.adminLogin, (password: string, callback: (newToken: any) => void) => {
            if (password === config['admin-password']) {
                let token = this.jwtEncode({loggedIn: true});
                callback(token);
            } else {
                callback(null);
            }
        });
    }
}