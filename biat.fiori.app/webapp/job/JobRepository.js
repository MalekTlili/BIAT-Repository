// @ts-nocheck
sap.ui.define([
    "sap/ui/base/Object"
], function (Object) {

    "use strict";
    return Object.extend("biat.fiori.app.JobRepository", {

        constructor: function (oComponent) {
            this._repo = {
                "Z_USER_INFO": this.getUserInfo.bind(this),
                "Z_DEMANDE_ACHAT": this.getDemandeAchatSet.bind(this),
                "Z_COMMANDE_ACHAT": this.getCommandeAchatSet.bind(this)
            };
            this._oComponent = oComponent;
            var oDataV2Model = this._oComponent.getModel();
            this.oDataV2Model = oDataV2Model;
        },

        getUserInfo: function (oConfig) {
            var that = this;

            this.oDataV2Model.read("/UserInfoSet('" + oConfig.email + "')", {
                method: "GET",

                success: that._fnSuccess(oConfig.successfn),
                error: that._fnError(oConfig.errorfn),

            });
        },

        getDemandeAchatSet: function (oConfig) {
            var that = this;
            var sFilter = "Ekgrp eq '" + oConfig.purchasingGroup + "' and Position eq'" + oConfig.position + "'";

            this.oDataV2Model.read("/DemandeAchatSet", {
                urlParameters: {
                    "$filter": sFilter
                },

                method: "GET",

                success: that._fnSuccess(oConfig.successfn),
                error: that._fnError(oConfig.errorfn),

            });
        },

        getCommandeAchatSet: function (oConfig) {
            var that = this;
            var sFilter = "Ekgrp eq '" + oConfig.purchasingGroup + "' and Position eq'" + oConfig.position +"'";

            this.oDataV2Model.read("/CommandeAchatSet", {
                urlParameters: {
                    "$filter": sFilter
                },

                method: "GET",

                success: that._fnSuccess(oConfig.successfn),
                error: that._fnError(oConfig.errorfn),

            });
        },

        _fnSuccess: function (fnSuccess) {
            var fnSuccessFnc = function (oResult) {

                fnSuccess.call(this, oResult);

            };
            return fnSuccessFnc.bind(this);
        },

        _fnError: function (fnError) {
            var fnErrorFnc = function (oResult) {

                fnError.call(this, oResult);

            };
            return fnErrorFnc.bind(this);
        },

        runjob: function (oConfig) {
            var fnJob = this._repo[oConfig.jobId];
            var iDelay = 0;
            jQuery.sap.delayedCall(iDelay, this, fnJob.bind(this), [oConfig]);
        }

    });

});
