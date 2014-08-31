var $ = require('jquery');

function handle401(jqXHR) {
  window.location = '/';
};


module.exports.configure = function() {

  $(document).ajaxError((event, jqXHR, ajaxSettings, thrownError) => {
    if (jqXHR.status === 401) {
      handle401(jqXHR);
    }
  });

};



