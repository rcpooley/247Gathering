import {Injectable} from '@angular/core';

import {DataSocket, DataStore, DataStoreClient} from 'datasync-js';
import * as socketIO from 'socket.io-client';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CoreService {

    private baseUrl: string;

    private client: DataStoreClient;
    private connected: boolean;

    constructor(private http: HttpClient) {
        this.baseUrl = 'http://localhost:80';
        this.client = new DataStoreClient();
        this.connect();
    }

    private connect() {
        let socket = socketIO('http://localhost');
        let dsock = DataSocket.fromSocket(socket);

        socket.on('connect', () => {
            console.log('Socket connected!');
            this.connected = true;
            this.client.setSocket(dsock);
            this.client.connectStore('settings');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.connected = false;
            this.client.clearSocket();
        });
    }

    public isConnected(): boolean {
        return this.connected;
    }

    public getSettingsStore(): DataStore {
        return this.client.getStore('settings');
    }

    public registerUser(firstname: string, lastname: string, email: string,
                        phone: string, howhear: number, howhearOther: string,
                        greek: number, greekOther: string, ministry: number, ministryOther: string) {
        this.http.post(this.baseUrl + '/register', {
            firstName: firstname,
            lastName: lastname,
            email: email,
            phone: phone,
            howhear: howhear,
            howhearOther: howhearOther,
            greek: greek,
            greekOther: greekOther,
            ministry: ministry,
            ministryOther: ministryOther
        }).subscribe(val => {
            window.location.href = '/';
        });
    }
}
