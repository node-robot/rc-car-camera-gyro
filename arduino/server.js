var chalk       = require('chalk');
var sp          = require('serialport');
var fs          = require('fs');
var buffertools = require('buffertools');
var events      = require('events');

var SerialPort = sp.SerialPort;
var serialPort = new SerialPort('/dev/tty.usbserial-FTH144MZ', { // tty.usbserial-FTH144MZ, tty.usbmodem1451
  baudrate: 38400
}, false);

var WritableBufferStream = buffertools.WritableBufferStream;
var ostream = new WritableBufferStream();
var ee = new events.EventEmitter();

serialPort.on('open', function(){
  console.log(chalk.blue('Serial Port : Open'));
});

serialPort.on('data', function(data) {
  ostream.write(data);
});

serialPort.on('close', function(){
  console.log(chalk.red('Serial Port : Closed'));
});

serialPort.open();

setInterval(function(){
  var buffer = ostream.getBuffer();

  var pos1 = buffertools.indexOf(buffer, 'IMAGEMARKER');
  var pos2 = buffertools.indexOf(buffer, 'IMAGEMARKER', pos1+1);

  if(pos1 < 0 || pos2 < 0)return;

  var jpgBuffer = buffer.slice(pos1+11, pos2);
  fs.writeFileSync(__dirname + '/../static/img/camera.jpg', jpgBuffer);

  buffer = buffer.slice(pos2);
  ostream = new WritableBufferStream();
  ostream.write(buffer);

  ee.emit('image');
}, 1000);

module.exports = ee;
