<!DOCTYPE html>
<html>
<head>
	<title>WebRTC By VIkash</title>
	
</head>
<style>
	.custom_file {
  margin: auto;
  opacity: 0;
  position: absolute;
  z-index: -1;
}
</style>
<body>
<h1>Welcome to WebRTC website with PeerJs Demo</h1>
My Id: <myId></myId><br>

<input type="text" id="remotePeerId" placeholder="ENter PeerId: ">
<button id="peerConnectBtn">COnnect</button>
<br>

Peer id:<remotePeer></remotePeer> Status:<peerStatus></peerStatus>
<br>

<div class="form-group">
	<label for="upload" class="btn btn-sm btn-primary">Upload Image</label>
	 <input type="file" class="text-center form-control-file custom_file" id="upload" name="user_image">
	 <label for="file_default">No File Choosen </label>
	 <label for="file_name"><b></b></label>
	 <button id="uploadBtn">UPLOAD</button>
 </div>
<input type="text" id="msgTxt" placeholder="ENter msg to send ">
<button id="sendMsgBtn">SEND</button>
<hr>
<div>
	<div id="progressText" style="display: none;"></div> 
</div><hr>

<br>
Messages:<br>
<div id="msgs"></div>
<div id="result"></div>






<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-database.js"></script>
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" rel="stylesheet"/>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-analytics.js"></script>

<script>
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyB1LwKSVU9Q76gFRozYCVdVfDZWLJ3z2r4",
    authDomain: "biradar-605d0.firebaseapp.com",
    databaseURL: "https://biradar-605d0-default-rtdb.firebaseio.com",
    projectId: "biradar-605d0",
    storageBucket: "biradar-605d0.appspot.com",
    messagingSenderId: "118083593781",
    appId: "1:118083593781:web:6bb0b1f926a22c4109737c",
    measurementId: "G-HC65J482GP"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var database = firebase.database();
  var ref=database.ref().child("videocall/testroom");

  
</script>
<script src="peerjs.min.js"></script>
<script src="jquery.js"></script>

<script src="app.js"></script>

</body>
</html>