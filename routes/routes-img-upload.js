/**
 * Created by Daniel on 01.09.2017.
 * This file contains all routes concerning the upload of images.
 */

"use strict";

// import necessary modules
var isAuthenticated = require("../passport/isAuthenticated.js");
var fs = require("fs");
var async = require("async");

module.exports = function(oApp) {

    /**
     * Display profile image.
     *
     * @name /profile-image/:username
     * @param username (optional)
     */
    oApp.get("/profile-image/:username?", isAuthenticated, (oReq, oRes) => {
        let sUserName = oReq.params.username;

        // get img path without extension
    	let sPath = (sUserName)
            ? "./img_profile/" + sUserName
            : "./img_profile/" + oReq.user.username;

        // possible file extensions
        let aExtensions = [".png", ".jpg", ".jpeg"];

        // check all file extensions if image exists
        async.each(aExtensions, function(sExt, fCallback) {

            // path with extension
            let sPathExt = sPath + sExt;

            // check if exists
            fs.stat(sPathExt, (oErr, oStat) => {
                if(!oErr) {
        			// file found -- send response
        			let oStream = fs.createReadStream(sPathExt);
        			oRes.setHeader("Content-type", "image/" + sExt.substring(1));
        			oStream.pipe(oRes);
                }
                fCallback();
            });
        }, function(oErr) {
            // file not found -- send default image
            let oStream = fs.createReadStream("./img_profile/default.png");
            oRes.setHeader("Content-type", "image/png");
            oStream.pipe(oRes);
        });
    });

    /**
     * Post a new image to the server.
     *
     * @name /image
     */
    oApp.post("/profile-image", isAuthenticated, (oReq, oRes) => {
    	let oWriteStream;
        oReq.pipe(oReq.busboy);

        oReq.busboy.on("file", (sFieldname, oFile, sFilename) => {
            oWriteStream = fs.createWriteStream(__dirname + "/img_profile/" + sFilename);
            oFile.pipe(oWriteStream);
            oWriteStream.on("close", () => {
    			oRes.redirect("back");
    		});
        });
    });
};
