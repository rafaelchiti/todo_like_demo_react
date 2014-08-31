var Backbone = require('backbone');
var _ = require('underscore');

var Store = Backbone.Collection.extend({

  addNotification: function(notification, sticky) {
    this._addNotification('default', notification, sticky);
  },

  addErrorNotification: function(notification, sticky) {
    this._addNotification('error', notification, sticky);
  },

  addSuccessNotification: function(notification, sticky) {
    this._addNotification('success', notification, sticky);
  },

  _addNotification: function(type, notification, sticky) {
    var alreadyExist = this.where({message: notification}).length > 0;

    if (alreadyExist)
      return;

    this.add({
      type: type,
      message: notification,
      sticky: sticky || false,
      createdTimestamp: new Date()
    });
  },

  cleanTemporalNotifications: function() {
    this.remove(this.where({sticky: false}));
  },

  cleanStickyNotifications: function() {
    this.remove(this.where({sticky: true}));
  },

  hasTemporalNotifications: function() {
    return this.where({sticky: false}).length > 0;
  },

  hasStickyNotifications: function() {
    return this.where({sticky: true}).length > 0;
  },

  cleanExpiredNotifications: function(now) {
    var nowInMilli = new Date().getTime();
    var stickyNotifiactionExpirationInMilli = 1000 * 10;
    var defaultNotifiactionExpirationInMilli = 2000;

    var listToRemove = this.filter(notification => {
      var expiration = notification.get('sticky') ? stickyNotifiactionExpirationInMilli : defaultNotifiactionExpirationInMilli;
      if (nowInMilli - notification.get('createdTimestamp') > expiration) {
        return true;
      } else {
        return false;
      }
    }, this);

    this.remove(listToRemove);
  }

});

module.exports = Store;