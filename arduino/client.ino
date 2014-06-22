#include "Adafruit_VC0706.h"
#include <SoftwareSerial.h>

SoftwareSerial cameraconnection = SoftwareSerial(2, 3);
Adafruit_VC0706 cam = Adafruit_VC0706(&cameraconnection);

void setup() {
  Serial.begin(38400);
  cam.begin();
  cam.setImageSize(VC0706_160x120); // VC0706_640x480, VC0706_320x240, VC0706_160x120
}

void loop() {
  takePhoto();
}

void takePhoto(){
  cam.reset();

  delay(100);

  if(!cam.takePicture())
    return;

  uint16_t jpglen = cam.frameLength();
  Serial.print("IMAGEMARKER");

  while (jpglen > 0) {
    uint8_t *buffer;
    uint8_t bytesToRead = min(32, jpglen);
    buffer = cam.readPicture(bytesToRead);
    Serial.write(buffer, bytesToRead);
    jpglen -= bytesToRead;
  }
}
