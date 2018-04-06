import {Injectable} from '@angular/core';
import * as socketIO from 'socket.io-client';
import {PacketRegister, PacketSearchUsers, PacketSettings, User} from "247-core/dist/interfaces/packets";
import {MyEvents} from "247-core/dist/events";
import {SettingsCallback} from "247-core/dist/interfaces/callbacks";

@Injectable()
export class CoreService {

    private baseUrl: string;

    private socket: SocketIOClient.Socket;
    private connected: boolean;

    //Cached responses
    private settings: PacketSettings;

    //Temp register name
    public tmpName: string = null;

    constructor() {
        this.baseUrl = 'http://localhost:80';
        this.connect();
    }

    private connect() {
        let socket = socketIO('http://localhost');

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

    public registerUser(regInfo: PacketRegister) {
        this.socket.emit(MyEvents.registerUser, regInfo);
    }

    public searchUsers(packet: PacketSearchUsers, callback: (users: User[]) => void) {
        this.socket.emit(MyEvents.searchUsers, packet, callback);
    }
}
