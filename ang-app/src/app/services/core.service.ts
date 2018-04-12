import {Injectable} from '@angular/core';
import * as socketIO from 'socket.io-client';
import {PacketSettings} from "247-core/src/interfaces/packets";
import {MyEvents} from "247-core/dist/events";
import {SettingsCallback} from "247-core/src/interfaces/callbacks";
import {User} from "247-core/src/interfaces/user";
import {Gathering} from "../../../../247-core/src/interfaces/gathering";

@Injectable()
export class CoreService {

    private url: string = 'http://localhost';
    //private url: string = 'http://247gathering.com';

    private socket: SocketIOClient.Socket;
    private connected: boolean;

    /** Admin stuff **/
    public token: any = null;

    //Cached responses
    private settings: PacketSettings;

    //Temp register name
    public tmpName: string = null;

    constructor() {
        //Check for cookie
        this.token = this.getCookie('token');

        this.connect();
    }

    private connect() {
        let socket = socketIO(this.url);

        socket.on('connect', () => {
            console.log('Socket connected!');
            this.connected = true;
            socket.emit(MyEvents.adminVerify, this.token, loggedIn => {
                if (!loggedIn) {
                    this.token = null;
                    this.deleteCookie('token');
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.connected = false;
        });

        this.socket = socket;
    }

    private setCookie(cname: string, cvalue: string, exdays: number) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    private getCookie(cname: string): string {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    private deleteCookie(cname: string) {
        this.setCookie(cname, '', -1);
    }

    public getSettings(callback: SettingsCallback) {
        if (this.settings) {
            callback(this.settings);
        } else {
            this.socket.emit(MyEvents.fetchSettings, callback);
        }
    }

    public registerUser(regInfo: User, callback: (success: boolean) => void) {
        this.socket.emit(MyEvents.registerUser, regInfo, callback);
    }

    public searchUsers(query: string, callback: (users: User[]) => void) {
        this.socket.emit(MyEvents.searchUsers, query, callback);
    }

    public checkInUser(userID: number, callback: (success: boolean) => void) {
        this.socket.emit(MyEvents.checkInUser, userID, callback);
    }

    public adminLogin(password: string, callback?: (loggedIn: boolean) => void) {
        this.socket.emit(MyEvents.adminLogin, password, (token: string) => {
            this.token = token;
            if (this.token != null) {
                this.setCookie('token', token, 365);
            } else {
                this.deleteCookie('token');
            }
            if (callback) callback(this.token != null)
        });
    }

    public adminGetUsers(callback: (users: User[]) => void) {
        this.socket.emit(MyEvents.adminGetUsers, callback);
    }

    public adminGetGatherings(callback: (gatherings: Gathering[]) => void) {
        this.socket.emit(MyEvents.adminGetGatherings, callback);
    }
}
