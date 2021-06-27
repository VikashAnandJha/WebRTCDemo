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



          console.log('UPER', data);
          
          
 
 if (data.toString() === 'Done!') {
    // Once, all the chunks are received, combine them to form a Blob
    console.log('chunk', fileChunks); 
    const file = new Blob(fileChunks,{type:gFileType});
  
    console.log('Received', file); 

var url = URL.createObjectURL(file);

 
    $('#msgs').append('<br><a target="blank" href="'+url+'">Download</a>')

   // gotfile(gFileType,gFileName,fileChunks);
    fileChunks = [];
    
  }
  else {
    // Keep appending various file chunks 
    gFileType=data.file.filetype;
          gFileName=data.file.filename;

    fileChunks.push(data.file.file);
  }



});

      
        // Send messages
       // conn.send('Hello!');
       peerConn=conn;
      
       
  updatePeerStatus();



      });





  });


var fileChunks = [];var gFileType,gFileName;

var timer=null;

var incomingFileName=""; var incoming=false; var gFilesize=0,recvdSize=0,downloadURL="";

  peer.on('connection', function(conn) { 
       


      conn.on('open', function() {

        connected=true;
        // Receive messages

        conn.on('data', function(data) {





if(data=="BEGIN_TRANSFER"){
  incoming=true;
  startProgress();

  timer = setInterval(function() {
      checkTransfer();

    }, 1000);


}


          if(data.file!=undefined){
             gFileType=data.file.filetype;
          gFileName=data.file.filename;
          gFilesize=data.file.filesize;

          recvdSize=recvdSize+data.file.file.byteLength;


    console.log('gFIleSize'+gFilesize+" recvd size: "+recvdSize); 

    fileChunks.push(data.file.file);
     console.log("Inserted to array");



          }
          
 

 
   

 
      
        peerConn=conn;
  updatePeerStatus();



      });


  });
    });



  function checkTransfer(){

 if (recvdSize==gFilesize  && gFilesize>0 ) {
    // Once, all the chunks are received, combine them to form a Blob
    console.log('chunk', fileChunks); 
    const file = new Blob(fileChunks,{type:gFileType});
  
    console.log('Finished the transfer. All bytes recv', file); 


    console.log('EQ gFIleSize'+gFilesize+" recvd size: "+recvdSize); 

var url = URL.createObjectURL(file);

 
    $('#msgs').append('<br><a target="blank" href="'+url+'">Download</a>')

   // gotfile(gFileType,gFileName,fileChunks);
    fileChunks = []; recvdSize=0; gFilesize=0;
     incoming=false;
    
  }

 

if(incoming==false){
  console.log("clearing the setInterval")
       clearInterval(timer);
    timer = null
 $('#progressText').html("Transfer Finished");


     }


  }



  function startProgress(){

    $('#progressText').html("incoming file...");
     $('#progressText').show();


     

  }




  function gotfile(filetype,filename,file){ 
   
   console.log(filetype+",file"+filename+" "+file)
    var blob = new Blob(file,filename,{type:filetype});
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

         const file = input.files[0];
    console.log('Sending', file);
    peerConn.send('BEGIN_TRANSFER'); 

    // We convert the file from Blob to ArrayBuffer
    file.arrayBuffer()
    .then(buffer => {
      /**
       * A chunkSize (in Bytes) is set here
       * I have it set to 16KB
       */
      const chunkSize = 16 * 1024;

      // Keep chunking, and sending the chunks to the other peer
      while(buffer.byteLength) {
        const chunk = buffer.slice(0, chunkSize);
        buffer = buffer.slice(chunkSize, buffer.byteLength);
        
       

 var fileData={
        file: chunk,
        filename: file.name,
        filetype: file.type,
        filesize: file.size
    };

    console.log(file.size);




      peerConn.send({"text":"sending file","file":fileData});

console.log("sending chunk..."+buffer.byteLength)

        
      }


    }).then(res => {
      console.log("done with sending chunk...")
//peerConn.send('Done!'); 
    });
 

   

 


      }
    
      

    document.getElementById("uploadBtn").addEventListener("click", function() {
        sendfile();
      });
  