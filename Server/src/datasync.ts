import {MyDB} from "./db";
import {DataSocket, DataStoreServer} from "datasync-js";

export class DataSync {

    private dsServer: DataStoreServer;

    constructor(private database: MyDB) {
        this.setupServer();
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
            .serveByUser('store');
    }
}