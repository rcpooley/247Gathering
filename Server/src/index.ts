import {MyDB} from "./db";

let config = require('./config.json');

let db = new MyDB(config.mysql.host, config.mysql.username,
    config.mysql.password, config.mysql.database, 3000);