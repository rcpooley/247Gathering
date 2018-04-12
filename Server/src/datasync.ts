import {MyDB} from "./db";
import {SettingsCallback} from "247-core/src/interfaces/callbacks";
import {PacketSettings} from "247-core/src/interfaces/packets";
import {MyEvents} from "247-core/dist/events";
import SocketIOStatic = require("socket.io");
import * as jwt from 'jsonwebtoken';
import {User} from "247-core/src/interfaces/user";
import {Gathering} from "247-core/src/interfaces/gathering";

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
        let events: string[] = [MyEvents.fetchSettings, MyEvents.registerUser, MyEvents.searchUsers, MyEvents.checkInUser];

        events.forEach(event => {
            socket.on(event, (...args) => {
                this[event](...args);
            });
        });

        this.adminEvents(socket);
    }

    private fetchSettings(callback: SettingsCallback) {
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

    private registerUser(user: User, callback: (success: boolean) => void) {
        //Verify info
        let keys = Object.keys(user);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].endsWith("Other")) continue;

            let val = user[keys[i]];

            if (!isNaN(parseInt(val))) continue;
            if (val.length == 0) return;
        }

        this.database.registerUser(user, userID => {
            this.checkInUser(userID, callback);
        });
    }

    private searchUsers(query: string, callback: (users: User[]) => void) {
        this.database.getMostRecentGathering((gathering: Gathering) => {
            this.database.getCheckIns(gathering.id, (ids: number[]) => {
                this.database.searchUsers(query, (users: User[]) => {
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

    private checkInUser(userID: number, callback: (success: boolean) => void) {
        //TODO also fix this logic
        this.database.getMostRecentGathering((gathering: Gathering) => {
            this.database.createCheckIn(gathering.id, userID, () => {
                callback(true);
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