/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"brcomdfp/evento_dfp/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
