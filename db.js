/**
 * Created by Daniel on 11.08.2016.
 * This file contains the db module.
 * It wraps the db connection and query process.
 */

// import necessary modules
var pg = require("pg");

const sConnectionString = "postgres://postgres:admin@localhost:5432/db_invoice_kuga";

module.exports = {

    /**
     * Queries the database.
     * @param sSql (sql string to be executed)
     * @param fCallback
     */
    query: function(sSql, fCallback) {
        pg.connect(sConnectionString, function(oErr, oClient, fDone) {
            oClient.query(sSql, function(oErr, oResult) {
                fDone();
                fCallback(oErr, oResult);
            });
        });
    }
};
