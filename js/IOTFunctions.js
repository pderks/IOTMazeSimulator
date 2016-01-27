
var connection;
function popup(){
    alert("Hello World");
}
function startServer(){
    var direction = 0;
    alert("Starting Server");
    //connect to viple
    connection = new WebSocket("ws://localhost:8124");
    connection.onopen = function(){
    
        document.getElementById("testing").innerHTML = 40;
    }
    if ("WebSocket" in window)
    {
        //alert("WebSocket is supported by your Browser!");
    }
    
     //alert("LISTENING SERVER");
    connection.onmessage = function(evt){
        var received = evt.data;
        var stringfy = received.toString();
        //alert(stringfy);
       // stringfy = "up down left right";
        //if(stringfy.indexOf("{\"servos\":[{\"isTurn\":false,\"servoID\":3,\"servoSpeed\":0},{\"isTurn\":false,\"servoId\":5,\"servoSpeed\":0}]}") > -1){
       var first = stringfy.split(":");
       
       
       
       
       ///////////lEFT/DOWN//////////////////
        if(first[4].indexOf("-0.5") > -1){
            if(first[7].indexOf("-0.5")){
                if(direction == 3){
                    direction = 0;
                }
                 else{
                     direction++;
                 }

              
            }
            else{
                alert(direction);
                if(direction == 0){
                    moveDown();
                }
                if(direction == 1){
                    moveRight();
                }
                if(direction == 2){
                    moveUp();
                }
                if(direction == 3){
                    moveLeft();
            }          
        }
    }
       ///////RIGHT/UP//////////////////////
      else if(first[4].indexOf("0.5") > -1){
            if(first[7].indexOf("-0.5")){
                if(direction == 0){
                    moveUp();
                }
                if(direction == 1){
                    moveLeft();
                }
                if(direction == 2){
                    moveDown();
                }
                if(direction == 3){
                    moveRight();
                }  
            }
            else{
                if(direction == 0){
                    direction = 3;
                }
                else{
                    direction--;
                    
                }
                
            }
        }
        
         
     
    }
    
    
}


function up(){
    var newX;
    var newY;
    newX = currRectX;
    newY = currRectY + 3;
    
    
    connection.send('up');
    document.getElementById("left").innerHTML = 0.5;
    document.getElementById("right").innerHTML = 0.5;
}

function down(){
        document.getElementById("left").innerHTML = -0.5;
    document.getElementById("right").innerHTML = -0.5;

    connection.send('down');
}

function left(){
    document.getElementById("left").innerHTML = -0.5;
    document.getElementById("right").innerHTML = 0.5;
    connection.send('left');
}

function right(){
   document.getElementById("left").innerHTML = 0.5;
    document.getElementById("right").innerHTML = -0.5;
    connection.send('right');
}

function stop(){
     document.getElementById("left").innerHTML = 0.0;
    document.getElementById("right").innerHTML = 0.0;
    connection.send('stop');
}    
                    
                    
                
     