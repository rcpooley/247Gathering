import {MyDB} from "./db";
import {DataSocket, DataStore, DataStoreServer} from "datasync-js";

export class DataSync {

    private dsServer: DataStoreServer;

    constructor(private database: MyDB) {
        this.setupServer();
        this.setupSettingsStore();
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
            .serveByUser('admin');
    }

    private setupSettingsStore() {
        let store = this.dsServer.getStore('settings');

        let involveOpts = ['CCF', 'a', 'B'];
        let hearOpts = ['Friends', 'My ministry', 'Email', 'Randomly wandered in'];

        store.ref('/involvement').update(involveOpts);
        store.ref('/hearaboutus').update(hearOpts);
    }

    private serveAdminStore() {
        this.dsServer.onBind((socket: DataSocket, store: DataStore, connInfo: any) => {
            
        });
    }
}