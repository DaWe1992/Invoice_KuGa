/**
 * Created by Daniel on 11.08.2016.
 * This file contains the db module.
 * It wraps the db connection and query process.
 */

//import necessary modules
var pg = require("pg");

const conString = "postgres://postgres:admin@localhost:5432/db_invoice_kuga";

module.exports = {

    /**
     * Query the database.
     * @param sql
     * @param callback
     */
    query: function(sql, callback) {
        pg.connect(conString, function(err, client, done) {
            client.query(sql, function(err, result) {
                done();
                callback(err, result);
            });
        });
    }
}