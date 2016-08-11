/**
 * Created by Daniel on 11.08.2016.
 * This is a test file.
 */

"use strict";

//import necessary modules
var fs = require("fs");
var mustache = require("mustache");

module.exports = function(app) {

    /**
     * Renders the test template.
     * @name /test
     */
    app.get("/test", function(req, res) {

        var data = {
            "test": "Hallo Welt",
            "persons": [
                "Daniel",
                "Carina",
                "Nicola",
                "Jochen",
                "Werner",
                "Christiane"
            ]
        };

        fs.readFile("./template/template.html", "utf-8",
        function(err, template) {
            var html;
            
            mustache.parse(template);
            html = mustache.render(template, data);
            res.send(html);
        });
    });
};