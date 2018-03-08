import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as socketIO from 'socket.io';
import {MyDB} from "./db";
import {DataSync} from "./datasync";

let config = require('./config.json');

export class Web {
    private app: express.Application;
    private server: http.Server;
    private database: MyDB;

    constructor() {
        this.setupDatabase();
        this.createApp();
        this.middleware();
        this.routes();
        this.createServer();
        this.initDataSync();
    }

    private setupDatabase() {
        this.database = new MyDB(config.mysql.host, config.mysql.username,
            config.mysql.password, config.mysql.database,
            config.mysql.reconnectDelay);
    }

    private createApp() {
        this.app = express();
    }

    private middleware() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
    }

    private routes() {
        this.app.post('/register', (req, res) => {
            let data = req.body;

            let firstName = data.firstName;
            let lastName = data.lastName;
            let email = data.email;
            let phone = data.phone;
            let howhear = data.howhear;
            let howhearOther = !!data.howhearOther ? data.howhearOther : '';
            let greek = data.greek;
            let greekOther = !!data.greekOther ? data.greekOther : '';
            let ministry = data.ministry;
            let ministryOther = !!data.ministryOther ? data.ministryOther : '';
            this.database.registerUser(firstName, lastName, email, phone, howhear, howhearOther, greek, greekOther, ministry, ministryOther);

            res.send('success');
        });

        this.app.use(express.static('../ang-app/dist'));
    }

    private createServer() {
        this.server = new http.Server(this.app);
    }

    private initDataSync() {
        let io: SocketIO.Server = socketIO(this.server);

        let datasync = new DataSync(this.database);

        io.on('connect', (socket: SocketIO.Socket) => {
            datasync.addSocket(socket);
        });
    }

    public start() {
        this.server.listen(config.port, () => {
            console.log(`Listening on *:${config.port}`);
        });
    }
}