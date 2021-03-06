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

if(data.peerId!=uid){
   $('#msgs').prepend("Peer Connected: "+data.peerId+"<br>");

 $('#remotePeerId').val(data.peerId);
}
           


    
    });

 
  }

var conn; var connected=false; var peerConn;

var fileChunks = [];var gFileType,gFileName;

var timer=null; var sentProgress=0; 
var upFname="",upFsize=0,upProgress=0; 
var downFname="",downFsize=0,downProgress=0; var downloadtimer=null;

var incomingFileName=""; var incoming=false; var gFilesize=0,recvdSize=0,downloadURL="";

  var prevProgress=0,currentProgress=0;
var speedCheckRUnning=false;
  $('#peerConnectBtn').click(function(e){

    e.preventDefault();

$(this).html("connecting..")

var remotePeer=$('#remotePeerId').val();

$('remotePeer').html(remotePeer);

      conn = peer.connect(remotePeer,{serialization:"binary"});

console.log(conn.serialization);

      conn.on('open', function() {

        connected=true;

        $('#connectForm').hide();
        $('#uploadFrom').show();
        // Receive messages 
        conn.on('data', function(data) {



          console.log('INCOMING DATA ', data);
          
          
  if(data+"".includes("SENT_PROGRESS"))
{
  var newdata=data;
        sentProgress = newdata.replace ( /[^\d.]/g, '' ); 
        sentProgress=Math.round( sentProgress )
        console.log(sentProgress);

        $('#sentProgressbar').show();
 $('#progress-sent').css('width', sentProgress+'%').attr('aria-valuenow', sentProgress); 

 $('#sentstatus').html(sentProgress+"% Sent")

upProgress=sentProgress;

 if(sentProgress==100){
    $('#fileInfo').show();
    $('#fileInfo').html(gFileName+" SENT Successfully")
    
    $('#sentProgressbar').hide();

    upProgress=100;

     clearInterval(timer);
     timer=null;
     $('#progressarea').fadeOut(2000)
     $('#mainarea').show()

     prevProgress=0,currentProgress=0;


 }
        
}


});

      
        // Send messages
       // conn.send('Hello!');
       peerConn=conn;
      
       
  updatePeerStatus();



      });





  });



  peer.on('connection', function(conn) { 

    console.log(conn);
       if(conn.peer!=undefined){
  $('remotePeer').html(conn.peer)
} 
 connected=true;

      conn.on('open', function() {

       
        // Receive messages

        conn.on('data', function(data) {











if(data=="BEGIN_TRANSFER"){
  incoming=true;
  startProgress();

  timer = setInterval(function() {
      checkTransfer();

    }, 1000);

showProgressArea(false);

}


          if(data.file!=undefined){
             gFileType=data.file.filetype;
          gFileName=data.file.filename;
          gFilesize=data.file.filesize;
          downFsize=gFilesize;

          recvdSize=recvdSize+data.file.file.byteLength;


    console.log('gFIleSize'+gFilesize+" recvd size: "+recvdSize); 



    fileChunks.push(data.file.file);

    var progress=(recvdSize/gFilesize)*100;

 showDownloadProgress(gFilesize,recvdSize,progress);


 progress=   Math.round( progress )


 if(progress==100){

   clearInterval(downloadtimer);
   downloadtimer=null;
   prevProgress=0,currentProgress=0;
   speedCheckRUnning=false;
 }

 downProgress=progress;

    // console.log("Inserted to array:"+progress+"%");
$('#recProgressbar').show();
 $('#progress-rec').css('width', progress+'%').attr('aria-valuenow', progress); 

$('#recstatus').html(progress+"% Recieved")



 conn.send("SENT_PROGRESS_"+progress);


 


          }
          
 

 
   

 
      


      });


        

  });


      peerConn=conn;
  updatePeerStatus();
    });



  function checkTransfer(){

 if (recvdSize==gFilesize  && gFilesize>0 ) {
    // Once, all the chunks are received, combine them to form a Blob 

    //var array = new Uint8Array(fileChunks);

downProgress=100;


    const file = new Blob(fileChunks,{type:gFileType});
  
    console.log('Finished the transfer. All bytes recv'); 


    console.log('EQ gFIleSize'+gFilesize+" recvd size: "+recvdSize); 



var url = URL.createObjectURL(file);

 
    $('#msgs').append('<br><a target="blank" href="'+url+'" download="'+gFileName+'">Download</a>')

   // gotfile(gFileType,gFileName,fileChunks);
   


      $('#fileInfo').show();
    $('#fileInfo').html(gFileName+" Recieved Successfully")
var progress=0;
 $('#progress-rec').css('width', progress+'%').attr('aria-valuenow', progress); 

    $('#recProgressbar').hide();



 $('#progressarea').fadeOut(2000)
     $('#mainarea').show()

 fileChunks = []; recvdSize=0; gFilesize=0; gFileType="",gFileName="";
     incoming=false;

  }

 

if(incoming==false){
  $('#recProgressbar').hide();
  console.log("clearing the setInterval")
       clearInterval(timer);
    timer = null;
    prevProgress=0,currentProgress=0;

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
      {
        $('peerStatus').html("<font color=green>Connected</font>")
        $('#connectForm').hide()

      }
      else
{
   $('peerStatus').html("<font color=red>Diconnected</font>")
      $('#connectForm').show()
}
     

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

        showProgressArea(true);



 
         const file = input.files[0];
         gFileName=file.name;
         upFsize=file.size;
         upFname=file.name;
    console.log('Sending', file);
    peerConn.send('BEGIN_TRANSFER'); 

    // We convert the file from Blob to ArrayBuffer
    file.arrayBuffer()
    .then(buffer => {
      /**
       * A chunkSize (in Bytes) is set here
       * I have it set to 16KB
       */
      const chunkSize = 50 * 1024;

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
  
 

  function showProgressArea(sent){

if(sent==true){

   var sentProgress=5;
$('#progress-sent').css('width', sentProgress+'%').attr('aria-valuenow', sentProgress); 
 

        $('#sentProgressbar').show();
        $('#sentstatus').html("Preparing To send");

$('#progressarea').show();


counterForUploadSpeed();


}else{

var progress=0;
 $('#progress-rec').css('width', progress+'%').attr('aria-valuenow', progress); 

    $('#recProgressbar').show();

$('#progressarea').show();

 //restting old data
  $('#filesizestats').html(0);
$('#bytessentstats').html(0);
$('#speedstats').html(0);
  
 showDownloadProgress(0,0,0);

}
   





  }


function counterForUploadSpeed(){ 


  //restting old data
  $('#filesizestats').html(0);
$('#bytessentstats').html(0);
$('#speedstats').html(0);



timer= setInterval(function(){


console.log("Checking upload speed");

var upFsizeInMB=(upFsize/(1024*1024));
$('#filesizestats').html(upFsizeInMB.toFixed(2)+"");

var bytesent=(upFsize*upProgress/100)/(1024*1024);
console.log(bytesent+"sent "+upFsize+"upfzise"+upProgress+"upprogress")
$('#bytessentstats').html(bytesent.toFixed(2)+"");


currentProgress=upProgress;

var diffProgress=currentProgress-prevProgress;


var speed=(upFsize*diffProgress/100)/(1024*1024);

console.log(currentProgress+"currentProgress "+prevProgress+"prevProgress"+diffProgress+"diffProgress"+" seed:"+speed)

if(speed>0)
$('#speedstats').html(speed.toFixed(2)+"");

prevProgress=currentProgress;

},1000);

}



function showDownloadProgress(size,rec,progress){ 


 downFsize=size;
 downProgress=progress;

 var downFsizeInMB=(size/(1024*1024));

if(downFsize>0)
$('#filesizestats').html(downFsizeInMB.toFixed(2)+"");

var byterec=(downFsize*downProgress/100)/(1024*1024);
console.log(byterec+"rec "+downFsize+"downfile"+downProgress+"downProgress")
if(byterec>0)
$('#bytessentstats').html(byterec.toFixed(2)+"");


if(!speedCheckRUnning){
  downloadtimer= setInterval(function(){

speedCheckRUnning=true;
console.log("Checking download speed");




currentProgress=downProgress;

var diffProgress=currentProgress-prevProgress;


var speed=(downFsize*diffProgress/100)/(1024*1024);

console.log("DownloadFSize"+downFsize+" - "+currentProgress+"currentProgress "+prevProgress+"prevProgress"+diffProgress+"diffProgress"+" seed:"+speed)

if(speed>0)
$('#speedstats').html(speed.toFixed(2)+"");

prevProgress=currentProgress;

},1000);
}






}

 