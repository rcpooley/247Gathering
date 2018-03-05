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
        let store = this.dsServer.getStore('settings');

        let involveOpts = ['CCF', 'a', 'B', 'c'];
        let hearOpts = [
            'Friends',
            'My ministry',
            'Email',
            'Randomly wandered in'];

        store.ref('/involvement').update(involveOpts);
        store.ref('/hearaboutus').update(hearOpts);
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