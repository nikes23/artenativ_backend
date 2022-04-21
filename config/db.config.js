//MySQL
const mySQL = require('mysql');

//Remote
const connectionString = {
    connectionLimit : 100,
    host : 'linux-web02.region10group.network',
    user : 'artenativ_de_db1',
    password : '5FYyV$L?&P!N',
    database : 'artenativ_de_db1',
    //database : 'nodejs-flutter',
    debug : false,
    dialect :  "mysql",
    port : 3306
}

/*
//Local
const connectionString = {
    connectionLimit : 100,
    host : '192.168.64.3',
    //host : 'localhost',
    user : 'toni',
    password : 'AK14031993nikes1',
    database : 'artenativ_de_db1',
    //database : 'nodejs-flutter',
    debug : false,
    port : 3306
}
 */

const db = mySQL.createPool(connectionString);

module.exports = {
   db,
    host : 'linux-web02.region10group.network',
    user : 'artenativ_de_db1',
    password : '5FYyV$L?&P!N',
    database : 'artenativ_de_db1',
    dialect :  "mysql",
    /*HOST: "192.168.64.3",
    USER: "toni",
    PASSWORD: "AK14031993nikes1",
    DB: "testdb",
    dialect: "mysql",*/
}

//MongoDB
/*
module.exports = {
    db: 'mongodb://localhost/ecommerce-app'
}
 */
