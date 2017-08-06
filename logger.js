/**
 * Created by Daniel on 06.08.2017.
 * This file contains the logger module.
 */

 "use strict";

// import necessary modules
var fs = require("fs");

module.exports = {

    // supported loglevels
    levels: {
        INFO: "INFO",
        WARN: "WARN",
        ERR: "ERR"
    },

    /**
     * Logs messages into files.
     *
     * @param sLevel (loglevel: INFO, WARN, ERR)
     * @param sMsg (message to be logged)
     */
    log: function(sLevel, sMsg) {
        var oDate = new Date();
        var sYear = oDate.getFullYear();

        fs.appendFile(
            "./logs/log" + sYear + ".txt",
            sLevel + "\t" + oDate + "\t" + sMsg + "\n",
            function(oErr) {}
        );
    },

    /**
     * Prints logs to console.
     * Usage from command line: node -e "require('./logger').printLog('logs/log2017.txt')"
     *
     * @param sFileName (name of log file to be printed)
     */
    printLog: function(sFileName) {
        fs.readFile(sFileName, "utf-8", function(oErr, sData) {
            console.log(sData);
        });
    }
};
