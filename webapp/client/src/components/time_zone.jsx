var React = require('react');
var moment = require('moment');

var TimeZone = React.createComponent({

   updateOnProps: {
    timeZone: 'model'
  },

  handleRemove: function() {
    var confirmed =  confirm('Are you sure you want to remove the ' +
      this.props.timeZone.get('name') + ' time zone?');

    if (confirmed)
      this.props.onRemove(this.props.timeZone.cid);
  },

  render: function() {
    var completeClass = '';

    return (
      <div className={'timeZone' + completeClass}>
        <div className="timeZone-name">{this.props.timeZone.get('name')}</div>
        <span className="timeZone-city">{this.props.timeZone.get('cityName')}</span>
        <span className="timeZone-offset">{this.props.timeZone.get('gmtOffset')}</span>

        <div className="timeZone-currentTime">
          <span className="">{this.asTwoDigits(this.currentMomentWithOffset().hours())}:</span>
          <span className="">{this.asTwoDigits(this.currentMomentWithOffset().minutes())}</span>
          <span> hs</span>
        </div>

        <span className="remove" onClick={this.handleRemove}>x</span>
      </div>
    );
  },

  asTwoDigits: function(value) {
    return ("0" + value).slice(-2);
  },

  currentMomentWithOffset: function() {
    var offsetHours = this.props.timeZone.get('gmtOffset');

    var now = moment.utc();
    now.add('hours', offsetHours);

    return now;
  },

});

module.exports = TimeZone;