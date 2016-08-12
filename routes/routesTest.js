/**
 * Created by Daniel on 11.08.2016.
 * This is a test file.
 */

"use strict";

//import necessary modules
var fs = require("fs");
var pdf = require("html-pdf");
var mustache = require("mustache");

module.exports = function(app) {

    var data = {
        "customer": {
            "address": "Herr",
            "firstname": "Daniel",
            "lastname": "Wehner",
            "street": "Im Pförtlein 14a",
            "zip": "97688",
            "city": "Bad Kissingen"
        },
        "invoice": {
            "id": "2016-0001",
            "timeOfDelivery": "10.07.2016",
            "date": "15.07.2016",
            "positions": [
                {
                    "qty": "5",
                    "pos": "Hauptmenü",
                    "unitPrice": "25,00 €",
                    "net": "125,00 €",
                    "vat": "50,00 €",
                    "gross": "175,00 €"
                },
                {
                    "qty": "5",
                    "pos": "Dessert",
                    "unitPrice": "15,00 €",
                    "net": "75,00 €",
                    "vat": "20,00 €",
                    "gross": "95,00 €"
                }
            ]
        }
    };

    /**
     * Renders the test template.
     * @name /test
     */
    app.get("/test", function(req, res) {

        //read template
        fs.readFile("./template/invoice.html", "utf-8", function(err, template) {
            var html;
            var path;

            //render template with data
            mustache.parse(template);
            html = mustache.render(template, data);

            //create pdf and pipe it to the response stream
            pdf.create(html).toStream(function(err, stream) {
                res.setHeader("Content-type", "application/pdf");
                res.setHeader("Content-disposition", "attachment; filename=Rechnung.pdf");
                stream.pipe(res);
            });
        });
    });
};