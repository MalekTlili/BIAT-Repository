sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "biat/fiori/app/job/AppConstants"
],
    function (Controller, AppConstants) {
        "use strict";

        return Controller.extend("biat.fiori.app.controller.Biat", {
                        
            onInit: function () {
                this.userInfoModel = this.getOwnerComponent().getModel("userInfo");
                this.getView().setModel(this.userInfoModel, "userInfo");

                this.achatModel = this.getOwnerComponent().getModel("achat");
                this.getView().setModel(this.achatModel);

                this.oEventBus = this.getOwnerComponent().getEventBus();
                this.getUserInfo();
            },

            

            getUserInfo: function () {

                var sUrl = this.getBaseURL() + "/user-api/currentUser";
                var oModel = new sap.ui.model.json.JSONModel();
                
                var oMock = {
                    firstname: "Malek",
                    lastname: "TLILI",
                    email: "malek.tlili@aymax.fr",
                    name: "malek.tlili@aymax.fr",
                    displayName: "Malek TLILI (malek.tlili@aymax.fr)"
                };

                // var oMock = {
                //     firstname: "Jacem",
                //     lastname: "ROUABEH",
                //     email: "jacem.rouabeh@aymax.fr",
                //     name: "jacem.rouabeh@aymax.fr",
                //     displayName: "Jacem ROUABEH (jacem.rouabeh@aymax.fr)"
                // };

                oModel.loadData(sUrl);
                oModel.dataLoaded()
                    .then(() => {
                        //check if data has been loaded
                        //for local testing, set mock data
                        if (!oModel.getProperty("/email")) {
                            this.userInfoModel.setProperty("/userInfo", oMock);
                        } else {
                            this.userInfoModel.setProperty("/userInfo", oModel.getData());
                        }

                        var oUserInfoJobConfig = {
                            jobId: AppConstants.Z_USER_INFO_EVENT,
                            successfn: this.fnUserInfoSuccess.bind(this),
                            errorfn: this.fnUserInfoError.bind(this),
                            finishEvent: AppConstants.RUN_JOB_EVENT,
                            jobChannel: AppConstants.JOB_CHANNEL,
                            email: this.userInfoModel.getProperty("/userInfo/email")
                        };

                        this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oUserInfoJobConfig);

                    })
                    .catch(() => {
                        this.userInfoModel.setProperty("/userInfo", oMock);
                    });
            },


            fnUserInfoSuccess: function (oResponse, oData) {
                var oCustomAttributes = {
                    purchasingGroup : oResponse.purchasingGroup,
                    position: oResponse.position
                };
                this.userInfoModel.setProperty("/customAttributes", oCustomAttributes);
                
                var oCmdAchatJobConfig = {
                    jobId: AppConstants.Z_COMMANDE_ACHAT_EVENT,
                    successfn: this.fnCommandeAchatSuccess.bind(this),
                    errorfn: this.fnCommandeAchatError.bind(this),
                    finishEvent: AppConstants.RUN_JOB_EVENT,
                    jobChannel: AppConstants.JOB_CHANNEL,
                    email: this.userInfoModel.getProperty("/userInfo/email"),
                    position: this.userInfoModel.getProperty("/customAttributes/position"),
                    purchasingGroup: this.userInfoModel.getProperty("/customAttributes/purchasingGroup")
                };

                this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oCmdAchatJobConfig);

                var oDemandeAchatJobConfig = {
                    jobId: AppConstants.Z_DEMANDE_ACHAT_EVENT,
                    successfn: this.fnDemandeAchatSuccess.bind(this),
                    errorfn: this.fnDemandeAchatError.bind(this),
                    finishEvent: AppConstants.RUN_JOB_EVENT,
                    jobChannel: AppConstants.JOB_CHANNEL,
                    email: this.userInfoModel.getProperty("/userInfo/email"),
                    position: this.userInfoModel.getProperty("/customAttributes/position"),
                    purchasingGroup: this.userInfoModel.getProperty("/customAttributes/purchasingGroup")
                };

                this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oDemandeAchatJobConfig);
            },

            fnUserInfoError: function (oResponse, oError) {

            },

            fnCommandeAchatSuccess: function (oResponse, oError) {
                this.achatModel.setProperty("/commandeAchat", oResponse.results);               
            },

            fnCommandeAchatError: function (oResponse, oError) {

            },

            fnDemandeAchatSuccess: function (oResponse, oError) {
                this.achatModel.setProperty("/demandeAchat", oResponse.results);
            },

            fnDemandeAchatError: function (oResponse, oError) {

            },

            getBaseURL: function () {
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                return appModulePath;
            }
        });
    });
