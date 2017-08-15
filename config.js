/**
 * Created by Daniel on 11.08.2017.
 * This file contains the configuration of the app.
 */

"use strict";

// return config object
module.exports = {
    app: {
        port: 8080
    },
    logger: {
        enabled: true,
        logErro: true,
        logInfo: false,
        logWarn: true
    },
    postgres: {
        // url: "postgres://postgres:admin@localhost:5432/db_invoice_kuga",
        // connection: {
        user: "postgres",
        host: "localhost",
        database: "db_invoice_kuga",
        password: "admin",
        port: 5432,
        // }
    },
    mongo: {
        url: "mongodb://localhost/users"
    }
};
