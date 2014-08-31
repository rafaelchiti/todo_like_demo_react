var React = require('react');

var TimeZoneFilter = React.createComponent({

  render: function() {
    return (
      <div className="timeZoneFilter" onSubmit={this.filterTimeZones}>

        <input  ref="name" type="text" onKeyUp={this.tryfilterTimeZones} placeholder="Filter by name"/>

        <input className="button" onClick={this.filterTimeZones} type="button" value="Filter"/>
      </div>
    );
  },

  tryfilterTimeZones: function(event) {
    var wasEnterKeyPressed = event.keyCode && event.keyCode == 13;
    var isSearchTermEmpty = this.refs.name.getDOMNode().value.trim() === "";

    if (isSearchTermEmpty || wasEnterKeyPressed) {
      this.filterTimeZones();
    }

  },

  filterTimeZones: function() {
    var name = this.refs.name.getDOMNode().value.trim();

    this.props.onFilterTimeZones(name);

    this.refs.name.getDOMNode().select();
  }
});

module.exports = TimeZoneFilter;