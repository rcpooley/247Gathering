import * as mysql from 'mysql';
import {Gathering} from "247-core/src/interfaces/gathering";
import {User} from "247-core/src/interfaces/user";

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

    public registerUser(user: User, callback: (userID: number) => void) {
        this.conn.query('INSERT INTO user(firstName, lastName, email, phone, howhear, howhearOther, ' +
            'ministry, ministryOther, greek, greekOther) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [user.firstName, user.lastName, user.email, user.phone,
            user.howhear, user.howhearOther, user.ministry, user.ministryOther, user.greek, user.greekOther], (err, result) => {
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

    public getMostRecentGathering(callback: (resp: Gathering) => void) {
        this.conn.query('SELECT * FROM gathering ORDER BY id DESC LIMIT 1', function (err, results) {
            if (err) throw err;

            if (results.length == 0) {
                callback(null);
            } else {
                callback(results[0]);
            }
        });
    }

    public createCheckIn(gatheringID: number, userID: number, callback: () => void) {
        this.conn.query('INSERT INTO checkin(gatheringID, userID) VALUES(?,?)', [gatheringID, userID], function (err) {
            if (err) throw err;
            callback();
        });
    }

    public getCheckIns(gatheringID: number, callback: (ids: number[]) => void) {
        this.conn.query('SELECT * FROM checkin WHERE gatheringID=?', [gatheringID], function (err, results) {
            if (err) throw err;
            callback(results.map(entry => entry.userID));
        });
    }

    public getGatherings(callback: (gatherings: Gathering[]) => void) {
        this.conn.query('SELECT * FROM gatherings', (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }

    public getUsers(callback: (users: User[]) => void) {
        this.conn.query('SELECT * FROM users', (err, results) => {
            if (err) throw err;
            callback(results);
        })
    }
}