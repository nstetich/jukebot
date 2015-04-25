(function() {
  "use strict";

  var socket;

  $(document).ready(function () {
    $('#connect').click(function (){
      // console.log("You clicked the button");
      $('#connect').prop('disabled', true);
      var token = $('#token').val();
      // console.log("Token: " + token + '\n');
      socket = io.connect('http://localhost:3000', {query: 'token=' + token});
      console.log(socket.id);
      socket.on('news', function (data) {
        $('#console').append(JSON.stringify(data)).append('\n');
        // socket.emit('my other event', { my: 'data' });
      });
      socket.on('foo', function (data) {
        $('#console').append(JSON.stringify(data)).append('\n');
      });
    });

    $('#play').click(function () {
      socket.emit('trackChange', {
        title: $('#songTitle').val(),
        artist: $('#songArtist').val()
      });
    });
  });
})();
