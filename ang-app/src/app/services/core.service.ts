import {Injectable} from '@angular/core';
import * as socketIO from 'socket.io-client';
import {
    PacketRegister,
    PacketResponse,
    PacketSearchUsers,
    PacketSettings,
    User
} from "247-core/dist/interfaces/packets";
import {MyEvents} from "247-core/dist/events";
import {SettingsCallback} from "247-core/dist/interfaces/callbacks";

@Injectable()
export class CoreService {

    private socket: SocketIOClient.Socket;
    private connected: boolean;

    //Cached responses
    private settings: PacketSettings;

    //Temp register name
    public tmpName: string = null;

    constructor() {
        this.connect();
    }

    private connect() {
        let socket = socketIO('http://247gathering.com');

        socket.on('connect', () => {
            console.log('Socket connected!');
            this.connected = true;
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.connected = false;
        });

        this.socket = socket;
    }

    public getSettings(callback: SettingsCallback) {
        if (this.settings) {
            callback(this.settings);
        } else {
            this.socket.emit(MyEvents.fetchSettings, callback);
        }
    }

    public registerUser(regInfo: PacketRegister, callback: (resp: PacketResponse) => void) {
        this.socket.emit(MyEvents.registerUser, regInfo, callback);
    }

    public searchUsers(packet: PacketSearchUsers, callback: (users: User[]) => void) {
        this.socket.emit(MyEvents.searchUsers, packet, callback);
    }

    public checkInUser(userID: number, callback: (resp: PacketResponse) => void) {
        this.socket.emit(MyEvents.checkInUser, {userID: userID}, callback);
    }
}
