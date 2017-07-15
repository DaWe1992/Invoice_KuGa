/**
 * Formatter module.
 * Defines formatter functions.
 * 15.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([], function() {
    "use strict";

    return {
        contactIcon: function(sContactType) {
            var oIcon = new sap.ui.core.Icon();

            switch(sContactType) {
                case "E-Mail":
                    oIcon.setSrc("sap-icon://email");
                    break;
                case "Telefon":
                    oIcon.setSrc("sap-icon://call");
                    break;
                default:
                    return sContactType;
            }

            return oIcon;
        }
    };
});
