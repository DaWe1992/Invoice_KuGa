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
    frontend: "_sapui5",
    logger: {
        enabled: true,
        logErro: true,
        logInfo: true,
        logWarn: true
    },
    postgres: {
        // url: postgres://postgres:admin@localhost:5432/db_invoice_kuga
        user: "postgres",
        host: "localhost",
        database: "db_invoice_kuga",
        password: "admin",
        port: 5432,
    },
    mongo: {
        url: "mongodb://localhost/users"
    },
    session: {
        secret: "mySecretKey",
        resave: true,
        saveUninitialized: true,
        cookieMaxAge: 7200000 // delete the session cookie after two hours
    }
};
