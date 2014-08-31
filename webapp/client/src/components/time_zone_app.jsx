var TimeZoneList = require('./time_zone_list');
var React = require('react');
var TimeZones = require('../models/time_zones');
var TimeZone = require('../models/time_zone');
var TimeZoneForm = require('./time_zone_form');
var TimeZoneFilter = require('./time_zone_filter');
var NotificationCenter = require('./notification_center');
var NotificationsStore = require('../models/notifications_store');

require('../utils/global_ajax_error_handler').configure();

var notifications = new NotificationsStore();

var TimeZoneApp = React.createComponent({

  getInitialState: function() {
    var timeZones = new TimeZones();

    timeZones.fetch();

    return {timeZones: timeZones};
  },

  filterTimeZones: function(name) {
    this.state.timeZones.fetchTimeZonesWithName(name);
  },

  addTimeZone: function(timeZone) {
    this.state.timeZones.create(timeZone, {success: successCb, error: errorCb, wait: true});

    function successCb(model) {
        notifications.addSuccessNotification('The Time Zone "' + model.get('name') + '" was successfully created', true);
    };

    function errorCb(model, response) {
        notifications.addErrorNotification('There was a problem when trying to save the Time Zone "' +
          model.get('name') + '". Please contact the administrator.', true);
    };
  },

  removeTimeZone: function(timeZoneCID) {
    var timeZone = this.state.timeZones.get(timeZoneCID);
    timeZone.destroy();
  },

  render: function() {
    window.notify = this.notifyError;
    return (
      <div className="timeZoneApp">
        <NotificationCenter notifications={notifications}/>
        <TimeZoneForm notificationsStore={notifications} onTimeZoneSubmit={this.addTimeZone} onNotifyError={this.notifyError}/>
        <TimeZoneFilter onFilterTimeZones={this.filterTimeZones}/>
        <TimeZoneList timeZones={this.state.timeZones}
            onRemove={this.removeTimeZone} />
      </div>
    );
  }

});

module.exports.start = function() {
  React.renderComponent(
    <TimeZoneApp/>,
    document.querySelector('.js-app-container')
  );
};
