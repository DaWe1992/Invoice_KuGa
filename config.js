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
    postgres: {
        url: "postgres://postgres:admin@localhost:5432/db_invoice_kuga"
    },
    mongo: {
        url: "mongodb://localhost/users"
    }
};
