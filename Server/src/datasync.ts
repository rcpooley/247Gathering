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

export class DataSync {

    constructor(private database: MyDB) {
    }

    public addSocket(socket: SocketIO.Socket): void {
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
        this.database.searchUsers(packet.query, (users: User[]) => {
            //TODO fix this logic
            if (users.length == 0) {
                callback([]);
            } else {
                let user = users[0];

                this.database.getMostRecentCheckIn(user.id, secTime => {
                    user.checkInTimeSec = secTime;
                    callback([user]);
                });
            }
        });
    }

    private checkInUser(packet: PacketCheckIn, callback: (resp: PacketResponse) => void) {
        //TODO also fix this logic
        this.database.createCheckIn(packet.userID, Math.floor(new Date().getTime() / 1000), () => {
            callback({success: true});
        })
    }
}