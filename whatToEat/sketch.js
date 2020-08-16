// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */

// Grab elements, create settings, etc.
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var text = "Iftar menu ?";
var newText;

var xCoordinateRect = 200;
var yCoordinateRect = 10;
var xCoordinateText = xCoordinateRect + 10; //+10
var yCoordinateText = yCoordinateRect + 40; //+40

// The detected positions will be inside an array
let poses = [];

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject=stream;
    video.play();
  });
}

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet
// is not detecting a position
function drawCameraIntoCanvas() {
  // Draw the video element into the canvas
  ctx.drawImage(video, 0, 0, 640, 480);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  //drawUpdater();
  window.requestAnimationFrame(drawCameraIntoCanvas);
}
// Loop over the drawCameraIntoCanvas function
drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, modelReady);
poseNet.on('pose', gotPoses);

// A function that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function modelReady() {
  console.log("model ready");
  poseNet.multiPose(video);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];

      if(keypoint.part == 'rightEye'){
        drawCtx(keypoint);
      }
    }
  }
}

function drawCtx(keypoint) {
    if (keypoint.score > 0.2) {
        drawUpdater(keypoint.position.x,keypoint.position.y);
    }

    document.getElementById("xinput").innerHTML = keypoint.position.x;
    document.getElementById("yinput").innerHTML = keypoint.position.y;

}

function drawUpdater(x, y) {
    xCoordinateRect = x - 10;
    yCoordinateRect = y - 100;
    xCoordinateText = x;
    yCoordinateText = y - 70;

    ctx.strokeStyle = 'orange';
    ctx.strokeRect(xCoordinateRect, yCoordinateRect, 150, 50);

    ctx.font = '20px serif';
    ctx.fillStyle = 'orange';
    ctx.fillText(text, xCoordinateText, yCoordinateText);

    setInterval(function(){
        updateWord();
    }, 5000);
  }

  function getRandomWord() {

      let textArray = ['Kuih','rojak','roti canai', 'bubur', 'kfc', 'mcd'];

      return textArray[Math.floor(Math.random() * textArray.length)];

  }

  function updateWord() {
    newText = getRandomWord();
    ctx.fillStyle = 'transparent'; // or whatever color the background is.
    ctx.fillText(text, xCoordinateText, yCoordinateText);
    ctx.fillStyle = 'orange'; // or whatever color the text should be.
    ctx.fillText(newText, xCoordinateText, yCoordinateText);
    text = newText;
  }