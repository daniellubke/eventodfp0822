sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/f/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, fioriLibrary) {
        "use strict";

        return Controller.extend("br.com.dfp.eventodfp.controller.Lista", {

            Formatter: Formatter,
            
            onInit: function () {
                this.oView = this.getView();
                this.oRouter = this.getOwnerComponent().getRouter();
            },

            onListItemPress: function (oEvent) {
                var productPath = oEvent.getSource().getBindingContext().getPath(),
                    product = oEvent.getSource().getBindingContext().getObject().Salesorderid;
                
                this.oRouter.navTo("detail", { layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, product: product });
            }
        });
    });
