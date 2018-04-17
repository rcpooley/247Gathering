import {MyDB} from "./db";
import {SettingsCallback} from "247-core/src/interfaces/callbacks";
import {PacketSettings} from "247-core/src/interfaces/packets";
import {MyEvents} from "247-core/dist/events";
import SocketIOStatic = require("socket.io");
import * as jwt from 'jsonwebtoken';
import {User} from "247-core/src/interfaces/user";
import {Gathering} from "247-core/src/interfaces/gathering";
import * as EventEmitter from 'events';
import {Song} from "247-core/src/interfaces/song";
import {GatheringSong} from "247-core/src/interfaces/gatheringSong";

let config = require('./config.json');

class MySocket extends EventEmitter {}

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

    private adminEvents(rawSocket: SocketIOStatic.Socket) {
        let socket = new MySocket();

        rawSocket.on(MyEvents.adminVerify, (token: string, callback: (loggedIn: boolean) => void) => {
            let decoded = this.jwtDecode(token);

            if (!!decoded.err) {
                callback(false);
            } else {
                callback(!!decoded.data && !!decoded.data.loggedIn);
            }
        });

        rawSocket.on(MyEvents.adminLogin, (password: string, callback: (newToken: any) => void) => {
            if (password === config['admin-password']) {
                let token = this.jwtEncode({loggedIn: true});
                callback(token);
            } else {
                callback(null);
            }
        });

        rawSocket.on('admin-event', (event: string, token: string, ...args: any[]) => {
            let decoded = this.jwtDecode(token);

            if (!decoded.err) {
                socket.emit(event, ...args);
            }
        });

        socket.on(MyEvents.adminGetUsers, (callback: (users: User[]) => void) => {
            this.database.getUsers(callback);
        });

        socket.on(MyEvents.adminGetGatherings, (callback: (gatherings: Gathering[]) => void) => {
            let proms = [];
            proms.push(new Promise(resolve => {
                this.database.getGatherings(resolve);
            }));
            proms.push(new Promise(resolve => {
                this.database.getAllGatheringSongs(resolve);
            }));

            Promise.all(proms).then(values => {
                let gatherings: Gathering[] = values[0];
                let songs: GatheringSong[] = values[1];

                let proms = gatherings.map(gathering => {
                    return new Promise(resolve => {
                        this.database.getCheckIns(gathering.id, ids => {
                            gathering.users = ids;
                            resolve();
                        });
                    });
                });

                Promise.all(proms).then(() => {
                    let gMap = {};
                    gatherings.forEach(gathering => {
                        gMap[gathering.id] = gathering;
                        gathering.songs = [];
                    });

                    songs.forEach(song => {
                        gMap[song.gatheringID].songs.push(song);
                    });

                    callback(gatherings);
                });
            });
        });

        socket.on(MyEvents.adminNewGathering, (time: number, callback: () => void) => {
            this.database.newGathering(time, callback);
        });

        socket.on(MyEvents.adminGetSongs, (callback: (songs: Song[]) => void) => {
            this.database.getSongs(callback);
        });

        socket.on(MyEvents.adminNewSong, (title: string, callback: () => void) => {
            this.database.addSong(title, callback);
        });

        socket.on(MyEvents.adminUpdateGatheringSongs, (gatheringID: number, songs: GatheringSong[], callback: () => void) => {
            this.database.getGatheringSongs(gatheringID, (curSongs: GatheringSong[]) => {
                let curIDs = curSongs.map(song => song.songID);
                let newIDs = songs.map(song => song.songID);
                let deletedSongs = curSongs.filter(song => newIDs.indexOf(song.songID) == -1);
                let addedSongs = songs.filter(song => curIDs.indexOf(song.songID) == -1);

                let proms = deletedSongs.map(song => new Promise(resolve => {
                    this.database.deleteGatheringSong(song.id, resolve);
                }));

                Promise.all(proms).then(() => {
                    proms = addedSongs.map(song => new Promise(resolve => {
                        this.database.addGatheringSong(gatheringID, song.songID, newID => {
                            song.id = newID;
                            resolve();
                        });
                    }));

                    Promise.all(proms).then(() => {
                        songs.sort((a, b) => a.orderNum - b.orderNum);
                        for (let i = 0; i < songs.length; i++) {
                            songs[i].orderNum = i;
                        }
                        this.database.reorderGatheringSongs(songs, callback);
                    });
                });
            });
        });
    }
}