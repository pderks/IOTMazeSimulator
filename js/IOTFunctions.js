
var connection;

function periodicMovement() { //every 250 milliseconds (.25 seconds) move the Robot
    //document.getElementById("testing").innerHTML = 'Current Motor States: Left Motor = ' + leftWheelPower + ' Right Motor' + rightWheelPower;
    document.getElementById("testing2").innerHTML = 'Current Motor States: Left Motor = ' + leftWheelPower + ' Right Motor' + rightWheelPower;
    if(leftWheelPower == 0 && rightWheelPower == 0) {
        accuLeft = 0; 
        accuRight = 0;}
    accuLeft = accuLeft + leftWheelPower;
    accuRight = accuRight + rightWheelPower;
    if((accuLeft - accuRight) >= 1.5) {
        if(heading == 0) {
            makeWhite(currRectX, currRectY, rWidth,rHeight);
            swapDim();
            rotateIndicatorRight();
            drawRectangle(newX, newY, "#0000FF");
            heading = 3;
            moveRight();
            moveLeft();
        } else {
            makeWhite(currRectX, currRectY, rWidth,rHeight);
            swapDim();
            if(heading == 1) rotateIndicatorFront();
            if(heading == 2) rotateIndicatorLeft();
            if(heading == 3) rotateIndicatorBack();
            drawRectangle(newX, newY, "#0000FF");
            heading--; 
            
            if(heading == 0)
            {
                moveUp();
                moveDown();
            }
            if(heading == 1)
            {
                moveLeft();
                moveRight();
            }
            if(heading == 2)
            {
                moveDown();
                moveUp();
            }
        }
        accuLeft = 0;
        accuRight = 0;
    } else if((accuRight - accuLeft) >= 1.5) { //turning left
        if(heading == 3) {
            heading = 0;
            makeWhite(currRectX, currRectY, rWidth,rHeight);
            swapDim();
            rotateIndicatorFront();
            drawRectangle(newX, newY, "#0000FF");
            moveUp();
            moveDown();
        } //facing right
        else {
            makeWhite(currRectX, currRectY, rWidth,rHeight);
            swapDim();
            if(heading == 2) rotateIndicatorRight();
            if(heading == 1) rotateIndicatorBack();
            if(heading == 0) rotateIndicatorLeft();
            drawRectangle(newX, newY, "#0000FF");
            heading++;
            
            if(heading == 1)
            {
                moveLeft();
                moveRight();
            }
            if(heading == 2)
            {
                moveDown();
                moveUp();
            }
            if(heading == 3)
            {
                moveRight();
                moveLeft();
            }
        };
        accuLeft = 0;
        accuRight = 0;
    }
    if(heading == 0) {
        if(leftWheelPower > 0 && rightWheelPower > 0) { //Up
            moveUp();
        } else if(leftWheelPower < 0 && rightWheelPower < 0) {
            moveDown();
        } 
    }else if(heading == 1) { //Left
       if(leftWheelPower > 0 && rightWheelPower > 0) { 
            moveLeft();
        } else if(leftWheelPower < 0 && rightWheelPower < 0) {
            moveRight();
        }
    } else if(heading == 2) { //Down
        if(leftWheelPower > 0 && rightWheelPower > 0) { 
            moveDown();
        } else if(leftWheelPower < 0 && rightWheelPower < 0) {
            moveUp();
        }
    } else if(heading == 3) { //Right
        if(leftWheelPower > 0 && rightWheelPower > 0) {
            moveRight();
        } else if(leftWheelPower < 0 && rightWheelPower < 0) {
            moveLeft();
        }
    }
    var t = setTimeout(periodicMovement, 250);
}

function startServer(){
    alert("Starting Server");
    //connect to VIPLE
    connection = new WebSocket("ws://" + document.getElementById("ipTxt").value + ":8124");
    
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
                    
                    
                
     