import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as expressSession from 'express-session';
import * as sharedsession from 'express-socket.io-session';
import * as socketIO from 'socket.io';
import * as cors from 'cors';
import {MyDB} from "./db";
import {DataSync} from "./datasync";

let config = require('./config.json');

export class Web {
    private app: express.Application;
    private server: http.Server;
    private database: MyDB;
    private session: any;

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

        this.session = expressSession({
            secret: config['session-secret'],
            resave: true,
            saveUninitialized: true,
            cookie: {secure: false}
        });

        this.app.use(this.session);

        this.app.use(cors());
    }

    private routes() {
        let roots = ['home', 'admin'];

        this.app.use((req, res, next) => {
            console.log('session', req.session);
            next();
        });

        roots.forEach(root => {
            this.app.get(`/${root}/*`, (req, res) => {
                res.sendFile(__dirname + '/public/index.html');
            });

            this.app.get(`/${root}`, (req, res) => {
                res.sendFile(__dirname + '/public/index.html');
            });
        });

        this.app.use(express.static(__dirname + '/public'));
    }

    private createServer() {
        this.server = new http.Server(this.app);
    }

    private initDataSync() {
        let io: SocketIO.Server = socketIO(this.server);

        io.use(sharedsession(this.session, {
            autoSave: true
        }));

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