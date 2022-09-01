/*global QUnit*/

sap.ui.define([
	"brcomdfp/evento_dfp/controller/Lista.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Lista Controller");

	QUnit.test("I should test the Lista controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
