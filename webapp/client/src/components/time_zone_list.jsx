var React = require('react');
var TimeZoneView = require('./time_zone');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TimeZoneList = React.createComponent({

  updateOnProps: {
    timeZones: 'collection'
  },

  render: function() {
    var timeZones = this.props.timeZones.map(timeZone => {
      return <TimeZoneView
                key={timeZone.cid} timeZone={timeZone}
                onRemove={this.props.onRemove} />;
    }, this);

    return (
      <div className="timeZoneList">
        {timeZones}
      </div>
    );
  }
});

module.exports = TimeZoneList;