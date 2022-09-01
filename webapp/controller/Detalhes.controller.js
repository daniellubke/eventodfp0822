sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("br.com.dfp.eventodfp.controller.Detalhes", {

            Formatter: Formatter,

            onInit: function () {
                var oOwnerComponent = this.getOwnerComponent();

                this.oRouter = oOwnerComponent.getRouter();
                this.oModel = oOwnerComponent.getModel();

                this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
            },

            _onProductMatched: function (oEvent) {
                this._product = oEvent.getParameter("arguments").product || this._product || "0";
                this.getView().bindElement({
                    path: "/ZCDS_TPL_SO_001('" + this._product + "')"
                });
            },

            onEditToggleButtonPress: function () {
                var oObjectPage = this.getView().byId("ObjectPageLayout"),
                    bCurrentShowFooterState = oObjectPage.getShowFooter();

                oObjectPage.setShowFooter(!bCurrentShowFooterState);
            },

            onExit: function () {
                this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
            },

            onPost: function (oEvent) {

                var t = this;
                var bundle = this.getView().getModel("i18n").getResourceBundle();

                var oPosition = this.getView().byId("list1").getItems().length + 1;

                

                var objPedido = {
                    Salesorderid: this._product,
                    Messageposition: Formatter.idformat(oPosition, "000"),
                    Message: oEvent.getParameter("value"),
                    Createdat: Formatter.ndateSAP(new Date()), 
                    Createdby: "DLUBKE"
                };

                var arrayOfPromises = [];

                if (!t.busyDialog) {
                    t.busyDialog = new sap.m.BusyDialog({
                        showCancelButton: false,
                        title: bundle.getText("sendBusyDialog")
                    });
                }

                t.busyDialog.open();

                //Criando o pedido
                var createRequest = this.getODataModel().create("/ZCDS_MESSAGES", objPedido);
                arrayOfPromises.push(createRequest);

                Promise.all(arrayOfPromises).then(function (promiseResolvesArray) {
                    if (promiseResolvesArray) {
                        if (promiseResolvesArray[0].response.statusCode === "201") {
                            t.busyDialog.close();
                            t.getView().getModel().refresh();
                        }
                    }

                }.bind(this)).catch(function (e) {

                    t.busyDialog.close();
                    var oRet = JSON.parse(e.responseText);
                    sap.m.MessageToast.show(oRet.error.message.value, {
                        duration: 5000
                    });


                });
            },

            onActionPressed: function (oEvent) {
                var t = this;
                var bundle = this.getView().getModel("i18n").getResourceBundle();

                

                var arrayOfPromises = [];

                if (!t.busyDialog) {
                    t.busyDialog = new sap.m.BusyDialog({
                        showCancelButton: false,
                        title: bundle.getText("sendDeleteBusyDialog")
                    });
                }

                t.busyDialog.open();

                //Deletando a mensagem
                var deleteRequest = this.getODataModel().delete(oEvent.getSource().getBindingContext().getPath());
                arrayOfPromises.push(deleteRequest);

                Promise.all(arrayOfPromises).then(function (promiseResolvesArray) {
                    if (promiseResolvesArray) {
                        if (promiseResolvesArray[0].response.statusCode === "204") {
                            t.busyDialog.close();
                            t.getView().getModel().refresh();
                        }
                    }

                }.bind(this)).catch(function (e) {

                    t.busyDialog.close();
                    var oRet = JSON.parse(e.responseText);
                    sap.m.MessageToast.show(oRet.error.message.value, {
                        duration: 5000
                    });


                });

            },


            getODataModel: function (objModel) {
                if (!this._odata) {
                    this._odata = new odataAPI(this.getView().getModel(objModel));
                }
                return this._odata;
            },
        });
    });
