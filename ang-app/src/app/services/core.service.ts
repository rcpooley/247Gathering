import {Injectable} from '@angular/core';
import * as socketIO from 'socket.io-client';
import {PacketRegister, PacketSettings} from "247-core/dist/interfaces/packets";
import {SettingsCallback} from "247-core/dist/interfaces/callbacks";
import {MyEvents} from "247-core/dist/events";

@Injectable()
export class CoreService {

    private baseUrl: string;

    private socket: SocketIOClient.Socket;
    private connected: boolean;

    //Cached responses
    private settings: PacketSettings;

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

    public isConnected(): boolean {
        return this.connected;
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
}
