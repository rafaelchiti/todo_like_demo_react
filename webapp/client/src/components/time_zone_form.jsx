var React = require('react');
var iz = require('iz');
var timeZoneRules = require('../../../../shared/models/time_zone_rules');
var _ = require('underscore');


var TimeZoneForm = React.createComponent({

  render: function() {
    return (
      <form className="timeZoneForm" onSubmit={this.addTimeZone}>
        <h1>Complete the details below for adding new time zones</h1>
        <input className="timeZoneForm__input" ref="name" type="text"
          placeholder="Time Zone name?"/>

        <input className="timeZoneForm__input" ref="cityName" type="text"
          placeholder="City / Abbreviation?"/>

        <input className="timeZoneForm__input" ref="gmtOffset" type="text"
          placeholder="GMT difference?"/>

        <input className="timeZoneForm__add button" type="submit" value="add"/>
      </form>
    );
  },

  validate: function(timeZoneProps) {
    var rules = iz.are(timeZoneRules);

    if (!rules.validFor(timeZoneProps)) {
      var errorMessages = _(_(rules.getInvalidFields()).map(field => { return field})).flatten();

      _(errorMessages).each(message => {
        this.props.notificationsStore.addErrorNotification(message, true);
      }, this);

      return false;
    }

    return true;
  },

  addTimeZone: function(event) {
    event.preventDefault();

    var timeZoneProps = {};
    timeZoneProps.name = this.refs.name.getDOMNode().value.trim();
    timeZoneProps.cityName = this.refs.cityName.getDOMNode().value.trim();
    timeZoneProps.gmtOffset = this.refs.gmtOffset.getDOMNode().value.trim();

    var valid = this.validate(timeZoneProps);

    if (!valid)
      return;

    this.refs.name.getDOMNode().value = '';
    this.refs.cityName.getDOMNode().value = '';
    this.refs.gmtOffset.getDOMNode().value = '';

    this.refs.name.getDOMNode().focus();

    this.props.onTimeZoneSubmit(timeZoneProps);

    return false;
  }

});

module.exports = TimeZoneForm;