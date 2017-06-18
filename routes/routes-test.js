/**
 * Created by Daniel on 11.08.2016.
 * This is a test file.
 */

"use strict";

// Import necessary modules
var fs = require("fs");
var pdf = require("html-pdf");
var mustache = require("mustache");

module.exports = function(app, ft) {

    var data = {
        "customer": {
            "address": "Herr",
            "firstname": "Max",
            "lastname": "Mustermann",
            "street": "Musterstraße 25",
            "zip": "12345",
            "city": "Musterstadt"
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

        // Read template
        fs.readFile("./template/invoice.html", "utf-8", function(err, template) {
            var html;
            var path;

            // Render template with data
            mustache.parse(template);
            html = mustache.render(template, data);

            // Create pdf and pipe it to the response stream
            pdf.create(html).toStream(function(err, stream) {
                res.setHeader("Content-type", "application/pdf");
                res.setHeader("Content-disposition", "attachment; filename=Rechnung_" + data.invoice.id + ".pdf");
                stream.pipe(res);
            });
        });
    });

    app.get("/test-feature-toggle", function(req, res) {
        var result = {
            msg: "Feature1 inaktiv"
        };

        if(ft.isFeatureEnabled("feature1")) {
            result.msg = "Feature1 aktiv";
        }

        return res.status(200).json(result);
    });
};
