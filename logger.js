/**
 * Created by Daniel on 06.08.2017.
 * This file contains the logger module.
 */

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
    }
};
