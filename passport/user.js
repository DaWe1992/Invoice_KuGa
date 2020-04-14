/**
 * Created by Daniel on 14.04.2020.
 */

"use strict";

// ==============================================================

// definition of users
var aUsers = [
	{id: 1, username: "DaWe", password: "D@W€1992"},
	{id: 2, username: "AOA", password: "D@t@sets"}
];

var mod = {};

/**
 * Finds a user by username.
 *
 * @param sUsername
 * @return user object if user was found, null otherwise
 */
mod.findByName = function(sUsername) {
	for(var i = 0; i < aUsers.length; i++) {
		if(aUsers[i].username == sUsername) {return aUsers[i];}
	}
	return null;
}

module.exports = mod;