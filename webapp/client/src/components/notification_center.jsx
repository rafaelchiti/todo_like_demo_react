var React = require('react');
var _ = require('underscore');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var NotificationCenter = React.createComponent({

  updateOnProps: {
    'notifications': 'collection'
  },


  render: function() {
    var that = this;

    var notifications = this.props.notifications.map(notification => {

      var typeClassName;
      if (notification.get('type') === 'error') {
        typeClassName = 'notification-error';
      } else if (notification.get('type') === 'success') {
        typeClassName = 'notification-success';
      } else {
        typeClassName = 'notification-default';
      }

      var removeClassExtras = notification.get('sticky') ? '' : 'is-hidden'

      return(
        <div key={notification.cid} className={'notification ' + typeClassName}>{notification.get('message')}
          <span onClick={that.removeNotification} data-notification-cid={notification.cid} className={'remove ' + removeClassExtras}>x</span>
        </div>
      )

    });

    return (
      <div className="notificationsCenter">
        <ReactCSSTransitionGroup transitionName="notification">
          {notifications}
        </ReactCSSTransitionGroup>
      </div>
    );
  },

  removeNotification: function(event) {
    this.props.notifications.remove(event.currentTarget.dataset.notificationCid);
  },

  componentDidMount: function() {
    this.notificationsInterval = setInterval(this.cleanExpiredNotifications, 200);
  },

  componentWillUmount: function() {
    clearInterval(this.notificationsInterval);
  },

  cleanExpiredNotifications: function() {
    this.props.notifications.cleanExpiredNotifications();
  }
});

module.exports = NotificationCenter;