import * as mysql from 'mysql';
import {User} from "247-core/dist/interfaces/packets";

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
                        greek: number, greekOther: string, ministry: number,
                        ministryOther: string, callback: (userID: number) => void) {
        this.conn.query('INSERT INTO user(firstName, lastName, email, phone, howhear, howhearOther, ' +
            'ministry, ministryOther, greek, greekOther) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstname, lastname, email, phone, howhear, howhearOther,
            ministry, ministryOther, greek, greekOther], function (err, result) {
            if (err) throw err;

            callback(result.insertId);
        });
    }

    public searchUsers(query: string, callback: (users: User[]) => void) {
        let spl = query.split(' ').filter(str => str.length > 0);

        if (spl.length == 0) {
            return callback([]);
        }

        let sql = 'SELECT * FROM user WHERE';
        let noOR = true;
        let args = [];

        spl.forEach(str => {
            if (!noOR) sql += ' OR';
            noOR = false;
            sql += ` firstName=? OR lastName=?`;
            args.push(str, str);
        });

        this.conn.query(sql, args, function (err, results) {
            if (err) throw err;
            callback(results.map(user => {
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    checkInTimeSec: 0
                }
            }));
        });
    }

    public getMostRecentCheckIn(userID: number, callback: (secTime: number) => void) {
        this.conn.query('SELECT * FROM checkin WHERE userID=? ORDER BY id DESC LIMIT 1', [userID], function (err, results) {
            if (err) throw err;

            if (results.length == 0) {
                callback(0);
            } else {
                callback(results[0]['time_sec']);
            }
        });
    }

    public createCheckIn(userID: number, timeSec: number, callback: () => void) {
        this.conn.query('INSERT INTO checkin(userID, time_sec) VALUES(?,?)', [userID, timeSec], function (err) {
            if (err) throw err;
            callback();
        });
    }
}