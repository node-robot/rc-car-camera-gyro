(function(){
  'use strict';

  $(document).ready(initialize);

  var socket, canvas, ctx, img;

  function initialize(){
    initializeSocketIo();
    canvas = $('#telemetry')[0];
    ctx = canvas.getContext('2d');
    img = new Image();
    $(img).on('load', paint);
  }

  function initializeSocketIo(){
    socket = io.connect();
    socket.on('image', request);
  }

  function request(){
    img.src = '/img/camera.jpg';
  }

  function paint(){
    ctx.drawImage(img, 0, 0, 300, 300);
  }
})();
