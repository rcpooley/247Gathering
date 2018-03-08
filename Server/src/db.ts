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

    public getGreekOpts(callback: (opts: string[]) => void): void {
        this.conn.query('SELECT * FROM greek', function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }

    public getMinistryOpts(callback: (opts: string[]) => void): void {
        this.conn.query('SELECT * FROM ministry', function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }

    public getHowHearOpts(callback: (opts: string[]) => void): void {
        this.conn.query('SELECT * FROM howhear', function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }

    public registerUser(firstname: string, lastname: string, email: string,
                        phone: string, howhear: number, howhearOther: string,
                        greek: number, greekOther: string, ministry: number, ministryOther: string) {
        this.conn.query('INSERT INTO user(firstName, lastName, email, phone, howhear, howhearOther, ' +
            'ministry, ministryOther, greek, greekOther) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstname, lastname, email, phone, howhear, howhearOther,
            ministry, ministryOther, greek, greekOther], function (err) {
            if (err) throw err;
        });
    }
}