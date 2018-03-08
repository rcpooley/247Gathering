import {MyDB} from "./db";
import {DataSocket, DataStore, DataStoreServer} from "datasync-js";
import {PacketRegister} from "./packets";

export class DataSync {

    private dsServer: DataStoreServer;

    constructor(private database: MyDB) {
        this.setupServer();
        this.serveSettingsStore();
        this.serveAdminStore();
    }

    public addSocket(socket: SocketIO.Socket): void {
        let dsock = DataSocket.fromSocket(socket);

        this.dsServer.addSocket(dsock);

        socket.on('disconnect', () => {
            this.dsServer.removeSocket(dsock);
        });
    }

    private setupServer() {
        this.dsServer = new DataStoreServer()
            .serveGlobal('settings')
            .serveByUser('user')
            .serveByUser('admin');
    }

    private serveSettingsStore() {
        this.updateSettingsStore();
    }

    public updateSettingsStore() {
        let store = this.dsServer.getStore('settings');

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
            store.ref('/').update({
                greekOpts: data[0],
                ministryOpts: data[1],
                hearOpts: data[2]
            });
        });
    }

    private serveUserStore() {
        this.dsServer.onBind((socket: DataSocket, store: DataStore, connInfo: any) => {
            store.ref('/register').on('updateDirect', (value: PacketRegister) => {

            });
        });
    }

    private serveAdminStore() {
        this.dsServer.onBind((socket: DataSocket, store: DataStore, connInfo: any) => {
            
        });
    }
}