import * as mysql from 'mysql';
import {Gathering} from "247-core/src/interfaces/gathering";
import {User} from "247-core/src/interfaces/user";
import {Song} from "247-core/src/interfaces/song";
import {GatheringSong} from "247-core/src/interfaces/gatheringSong";

interface OrderPair {
    id: number;
    orderNum: number;
}

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
        this.conn.query('SELECT * FROM gathering', (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }

    public getUsers(callback: (users: User[]) => void) {
        this.conn.query('SELECT * FROM user', (err, results) => {
            if (err) throw err;
            callback(results);
        })
    }

    public newGathering(time: number, callback: () => void) {
        this.conn.query('INSERT INTO gathering(time) VALUES(?)', [time], (err, result) => {
            if (err) throw err;
            callback();
        });
    }

    public getSongs(callback: (songs: Song[]) => void) {
        this.conn.query('SELECT * FROM song', (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }

    public addSong(title: string, callback: () => void) {
        this.conn.query('INSERT INTO song(title) VALUES(?)', [title], (err, result) => {
            if (err) throw err;
            callback();
        });
    }

    public reorderGatheringSongs(newOrder: OrderPair[], callback: () => void) {
        let proms = newOrder.map(order => new Promise(resolve => {
            this.conn.query('UPDATE `gathering-song` SET orderNum=? WHERE id=?', [order.orderNum, order.id], err => {
                if (err) throw err;
                resolve();
            });
        }));

        Promise.all(proms).then(callback);
    }

    public getGatheringSongs(gatheringID: number, callback: (songs: GatheringSong[]) => void) {
        this.conn.query('SELECT * FROM `gathering-song` WHERE gatheringID=?', [gatheringID], (err, results) => {
            if (err) throw err;
            results.sort((a, b) => a.orderNum - b.orderNum);
            callback(results);
        });
    }

    public addGatheringSong(gatheringID: number, songID: number, callback: () => void) {
        this.getGatheringSongs(gatheringID, (songs: GatheringSong[]) => {
            let orderNum = songs.length == 0;
            this.conn.query('INSERT INTO `gathering-song`(gatheringID, songID, orderNum) VALUES(?,?,?)', [gatheringID, songID, orderNum], err => {
                if (err) throw err;
                callback();
            });
        });
    }

    public deleteGatheringSong(id: number, callback: () => void) {
        this.conn.query('DELETE FROM `gathering-song` WHERE id=?', [id], err => {
            if (err) throw err;
            callback();
        });
    }
}