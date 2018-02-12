import {Injectable} from '@angular/core';

import {DataSocket, DataStoreClient} from 'datasync-js';
import * as socketIO from 'socket.io-client';

@Injectable()
export class CoreService {

    private client: DataStoreClient;
    private connectLock: boolean;

    constructor() {
        this.client = new DataStoreClient();
        this.tryConnect();
    }

    private delayConnect() {
        if (this.connectLock) {
            return;
        }
        this.connectLock = true;
        setTimeout(() => {
            this.connectLock = false;
            this.tryConnect();
        }, 3000);
    }

    private tryConnect() {
        let socket = socketIO('http://localhost', {
            reconnection: false
        });
        let dsock = DataSocket.fromSocket(socket);

        socket.on('connect', () => {
            this.client.setSocket(dsock);
        });

        socket.on('disconnect', () => {
            this.client.setSocket(null);
            this.delayConnect();
        });

        socket.on('error', () => {
            this.client.setSocket(null);
            this.delayConnect();
        });
    }
}
