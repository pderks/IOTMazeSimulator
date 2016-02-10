
var connection;

function periodicMovement() { //every 250 milliseconds (.25 seconds) move the Robot
    //document.getElementById("testing").innerHTML = 'Current Motor States: Left Motor = ' + leftWheelPower + ' Right Motor' + rightWheelPower;
    document.getElementById("testing2").innerHTML = 'Current Motor States: Left Motor = ' + leftWheelPower + ' Right Motor' + rightWheelPower;
    var t = setTimeout(periodicMovement, 250);
}

function startServer(){
    var direction = 0;
    alert("Starting Server");
    //connect to VIPLE
    connection = new WebSocket("ws://localhost:8124");
    
    connection.onopen = function(){
        document.getElementById("testing").innerHTML = 40;
        periodicMovement();
    }
    
    if ("WebSocket" in window)
    {
        //alert("WebSocket is supported by your Browser!");
    }
    
    connection.onmessage = function(evt){
        var received = evt.data;
        var jsobject = JSON.parse(received);
        leftWheelPower = Number(jsobject.servos[0].servoSpeed);
        rightWheelPower = Number(jsobject.servos[1].servoSpeed);
        isLeftTurn = Boolean(jsobject.servos[0].isTurn);
        isRightTurn = Boolean(jsobject.servos[1].isTurn);
        
        
        var stringfy = received.toString();
        //alert(stringfy);
        // stringfy = "up down left right";
        //if(stringfy.indexOf("{\"servos\":[{\"isTurn\":false,\"servoID\":3,\"servoSpeed\":0},{\"isTurn\":false,\"servoId\":5,\"servoSpeed\":0}]}") > -1){
        var first = stringfy.split(":");

        //Cases for Rotate Left and Move Down
        if(first[4].indexOf("-0.5") > -1){
            if(first[7].indexOf("-0.5")){
                //Case to Rotate Left
                if(direction == 3){ 
                    makeWhite(currRectX, currRectY, rWidth,rHeight);
                    swapDim();
                    rotateIndicatorFront();
                    drawRectangle(newX, newY, "#0000FF");
                    direction = 0;
                }
                else{
                    makeWhite(currRectX, currRectY, rWidth,rHeight);
                    swapDim();
                    if(direction == 2) rotateIndicatorRight();
                    if(direction == 1) rotateIndicatorBack();
                    if(direction == 0) rotateIndicatorLeft();
                    drawRectangle(newX, newY, "#0000FF");
                    direction++;
                 }  
            }
            //Case to Move Down
            else{
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
        //Cases for Rotate Right and Move Up
        else if(first[4].indexOf("0.5") > -1){
            //Case to Move Up
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
            //Case to Rotate Right
            else{
                if(direction == 0){
                    makeWhite(currRectX, currRectY, rWidth,rHeight);
                    swapDim();
                    rotateIndicatorRight();
                    drawRectangle(newX, newY, "#0000FF");
                    direction = 3;
                }
                else{
                    makeWhite(currRectX, currRectY, rWidth,rHeight);
                    swapDim();
                    if(direction == 1) rotateIndicatorFront();
                    if(direction == 2) rotateIndicatorLeft();
                    if(direction == 3) rotateIndicatorBack();
                    drawRectangle(newX, newY, "#0000FF");
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
                    
                    
                
     