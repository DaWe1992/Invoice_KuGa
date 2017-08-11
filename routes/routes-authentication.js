/**
 * Created by Daniel on 11.08.2017.
 * This file contains all routes concerning the user authentication.
 */

"use strict";

module.exports = function(oApp, passport) {

	/**
     * Shows the login screen.
     *
     * @name /login
     *
     *
     */
	oApp.get("/login", function(req, res) {
    	// display the login page with flash message (if present)
		res.render("login", {
            message: req.flash("message")
        });
	});

    /**
     * Handles login post.
     *
     * @name /login
     */
	oApp.post("/login", passport.authenticate("login", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	}));

    /**
     * Shows the signup screen.
     *
     * @name /signup
     */
	oApp.get("/signup", function(oReq, oRes){
		oRes.render("register", {
            message: oReq.flash("message")
        });
	});

    /**
     * Handles signup post.
     *
     * @name /signup
     */
	oApp.post("/signup", passport.authenticate("signup", {
		successRedirect: "/login",
		failureRedirect: "/signup",
		failureFlash : true
	}));

    /**
     * Handles logout post.
     *
     * @name /logout
     */
	oApp.post("/logout", function(oReq, oRes) {
		oReq.logout();
		oRes.redirect("/login");
	});
};
