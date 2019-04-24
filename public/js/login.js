function login() {
  $.ajax({
    type: 'post',
    url: '/editor/login',
    data: $('#loginForm').serialize(),
    success: function(json) {
      var data = JSON.parse(json);
      if (data.success)
        window.location = '/editor/dashboard';
      else {
        if (typeof data.errors != 'undefined')
          $('#error').text(data.errors[0]);
      }
    },
    error: function() {
      $('#error').text('error contacting login server');
    }
  })
}