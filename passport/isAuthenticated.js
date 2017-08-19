/**
 * Created by Daniel on 11.08.2017.
 * Middleware to check the user's authentication.
 */

"use strict";

module.exports = function(oReq, oRes, fNext) {
	
	// if user is authenticated in the session, call the fNext() function to call the next request handler.
	// passport adds this method to the request object. A middleware is allowed to add properties to
	// request and response objects.
	if(oReq.isAuthenticated()) {
		return fNext();
    }

	// if the user is not authenticated then redirect him to the login page
	oRes.redirect("/login");
};
