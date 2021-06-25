var peer = new Peer(); 
var uid;
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    $('myId').html(id);

    updateIdToFirebase(id);

    uid=id;

    listOnlineUsers()


  });


  function updateIdToFirebase(id)
  {



    var keyRef=ref.push();
    keyRef.set({
        peerId: id,
        available: true
      });

      keyRef.onDisconnect().remove();
      
  }

  function listOnlineUsers(){


    ref.on('child_added', (data) => {

          
          
            var data = data.val();

            console.log(data)

            $('#msgs').append("<br>Peer Connected:"+data.peerId);

 


    
    });

 
  }

var conn; var connected=false; var peerConn;
  $('#peerConnectBtn').click(function(){
var remotePeer=$('#remotePeerId').val();

$('remotePeer').html(remotePeer);

      conn = peer.connect(remotePeer,{serialization:"binary-utf8"});

console.log(conn.serialization);
      conn.on('open', function() {

        connected=true;
        // Receive messages
        conn.on('data', function(data) {
          console.log('Received', data.text);
          $('#msgs').append("<br>Recvd:"+data.text);
          
          console.log(data)
          
           
          if(data.file!=null){
            $('#msgs').append("<br>Recvd file:"+data.file.filetype);
            gotfile(data.file)
          }
        

        });
      
        // Send messages
       // conn.send('Hello!');
       peerConn=conn;
      
       
  updatePeerStatus();



      });





  });


  peer.on('connection', function(conn) { 
       


      conn.on('open', function() {

        connected=true;
        // Receive messages
        conn.on('data', function(data) {
          console.log('Received', data.text);
          $('#msgs').append("<br>Recvd:"+data.text);
          
          console.log(data)
          if(data.file!=null){
            $('#msgs').append("<br>Recvd file:"+data.file.filetype);
            gotfile(data.file)
          }
        




        });
      
        peerConn=conn;
  updatePeerStatus();



      });


  });


  function gotfile(data){ 
   
    var blob = new Blob([data.file], {type: data.filetype});
var url = URL.createObjectURL(blob);

 
    $('#msgs').append('<br><a target="blank" href="'+url+'">Download</a>')

  }
  



  function updatePeerStatus()
  {

      if(connected)
      $('peerStatus').html("<font color=green>Connected</font>")
      else

      $('peerStatus').html("<font color=red>Diconnected</font>")

  }


  updatePeerStatus();

 

  $('#sendMsgBtn').click(function(){
    var msgTxt=$('#msgTxt').val();
    
    if(connected){
        peerConn.send({"text":msgTxt,"file":null});
        $('#msgs').append("<br>sent:"+msgTxt);

    }
    
    
    
    
      });



      $('#upload').change(function() {
        var filename = $('#upload').val();
        if (filename.substring(3,11) == 'fakepath') {
            filename = filename.substring(12);
        } // For Remove fakepath
        $("label[for='file_name'] b").html(filename);
        $("label[for='file_default']").text('Selected File: ');
        if (filename == "") {
            $("label[for='file_default']").text('No File Choosen');
        }

 

    });


   
      var input = document.getElementById("upload"),
      output = document.getElementById("result"),
      fileData; // We need fileData to be visible to getBuffer.
    
      // Eventhandler for file input. 
      function sendfile() {
        var files = input.files;
        // Pass the file to the blob, not the input[0].
        fileData = new Blob([files[0]]);

        


        var file = files[0];
    var blob = new Blob(input.files, {type: file.type});

    var fileData={
        file: blob,
        filename: file.name,
        filetype: file.type
    };

    console.log(fileData);

    peerConn.send({"text":"Reciving file","file":fileData});


        // Pass getBuffer to promise.
        var promise = new Promise(getBuffer);
        // Wait for promise to be resolved, or log error.
        promise.then(function(data) {
          // Here you can pass the bytes to another function.
        //  output.innerHTML = data.toString();
        
         
          console.log(data);
        }).catch(function(err) {
          console.log('Error: ',err);
        });
      }
    
      /* 
        Create a function which will be passed to the promise
        and resolve it when FileReader has finished loading the file.
      */
      function getBuffer(resolve) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(fileData);
        reader.onload = function() {
          var arrayBuffer = reader.result
          var bytes = new Uint8Array(arrayBuffer);
          resolve(bytes);
        }
      }
    
      // Eventlistener for file input.
     // input.addEventListener('change', openfile, false);
   

    document.getElementById("uploadBtn").addEventListener("click", function() {
        sendfile();
      });
  