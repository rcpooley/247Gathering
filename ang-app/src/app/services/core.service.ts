import {Injectable} from '@angular/core';

import {DataSocket, DataStore, DataStoreClient} from 'datasync-js';
import * as socketIO from 'socket.io-client';

@Injectable()
export class CoreService {

    private client: DataStoreClient;
    private connected: boolean;

    constructor() {
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
}
