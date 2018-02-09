import * as mysql from 'mysql';

export class MyDB {

    private conn: mysql.Connection;
    private connectLock: boolean;

    constructor(private host: string,
                private username: string,
                private password: string,
                private database: string,
                private reconnectDelay: number) {
        this.connectLock = false;
        this.connect();
    }

    private delayConnect(): void {
        if (this.connectLock) {
            return;
        }

        this.connectLock = true;
        setTimeout(() => {
            this.connectLock = false;
            this.connect();
        }, this.reconnectDelay);
    }

    private connect(): void {
        this.conn = mysql.createConnection({
            host: this.host,
            user: this.username,
            password: this.password,
            database: this.database
        });

        this.conn.connect(err => {
            if (err) {
                console.error('Could not connect to mysql server:', err);
                this.delayConnect();
                return;
            }

            console.log('Connected to database');
        });

        this.conn.on('error', err => {
            console.error('Mysql error:', err);
            this.delayConnect();
        });
    }
}