/**
 * Created by Daniel on 11.08.2017.
 */

"use strict";

// import necessary modules
var mongoose = require("mongoose");

module.exports = mongoose.model("User", {
    id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String
});
