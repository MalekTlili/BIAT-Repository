/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "biat/fiori/app/model/models",
    "biat/fiori/app/job/JobRepository",
    "biat/fiori/app/job/AppConstants"
],
    function (UIComponent, Device, models, JobRepository, AppConstants) {
        "use strict";

        return UIComponent.extend("biat.fiori.app.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.JobRepository = new JobRepository(this);

                var oEventBus = this.getEventBus();
                oEventBus.subscribe(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, this._onRunJob.bind(this), this);

            },

            _onRunJob: function (sChannel, sEvent, oData) {
                this.JobRepository.runjob(oData);
            },

            destroy: function () {
                var oEventBus = this.getEventBus();
                oEventBus.unsubscribe(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, this._onRunJob.bind(this), this);
                UIComponent.prototype.destroy.apply(this, arguments);

            }
        });
    }
);