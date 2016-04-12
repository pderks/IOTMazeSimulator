
var connection;

function WSsendSensorInfo() {
    
    /*
     * 
     * Direction <select> Lookup table
     * Front = 0
     * Back = 1
     * Left = 2
     * Right = 3
     */
    
    //'{"sensors": [{"name":"touch", "id":0, "value":0}, {"name":"distance", "id":0, "value":12.8}]}'
    var messageToSend ='{"sensors": [' 
    var sensor1message = '{"name":' + sensor1Type + ', "id":' + sensor1ID +  ', "value":';
    var sensor2message = '{"name":' + sensor2Type + ', "id":' + sensor2ID +  ', "value":';
    var messageCloser = ']}';
    var sens1val;
    var sens2val;
    var dists = new Array(upDist, leftDist, downDist, rightDist);
    
    if(document.getElementById("sensor1DirSelect").selectedIndex == 0) {
        sens1val = dists[heading];
    } else if(document.getElementById("sensor1DirSelect").selectedIndex == 1) { //back
        if(heading < 2) {sens1val = dists[heading + 2];} //head = 0 or 1
        else if(heading >= 2) {sens1val = dists[heading - 2];} //head = 2 or 3
    } else if(document.getElementById("sensor1DirSelect").selectedIndex == 2) { //left
        if(heading <= 2) {sens1val = dists[heading + 1];}
        else if(heading == 3) {sens1val = dists[0];}
    } else {
        if(heading > 0) {sens1val = dists[heading - 1];}
        else {sens1val = dists[3]}
    } //right
    
    if(sensor1Type == '"touch"') { //sens1val is now up, down, left, or right dist
        if(sens1val < 6) { sens1val = 1;}
        else {sens1val = 0}
    }
    
    sensor1message = sensor1message + sens1val + '}';
    
    if(document.getElementById("sensor2DirSelect").selectedIndex == 0) {
        sens2val = dists[heading];
    } else if(document.getElementById("sensor2DirSelect").selectedIndex == 1) { //back
        if(heading < 2) {sens2val = dists[heading + 2];} //head = 0 or 1
        else if(heading >= 2) {sens2val = dists[heading - 2];} //head = 2 or 3
    } else if(document.getElementById("sensor2DirSelect").selectedIndex == 2) { //left
        if(heading <= 2) {sens2val = dists[heading + 1];}
        else if(heading == 3) {sens2val = dists[0];}
    } else {
        if(heading > 0) {sens2val = dists[heading - 1];}
        else {sens2val = dists[3]}
    } //right
    
    if(sensor2Type == '"touch"') { //sens1val is now up, down, left, or right dist
        if(sens2val < 6) { sens2val = 1;}
        else {sens2val = 0}
    }
    sensor2message = sensor2message + sens2val + '}'; 
    
    if(sensor2Type ==  -1 && sensor1Type == -1) {return;}
    if(sensor1Type == -1 && (sensor2Type == '"touch"' || sensor2Type == '"distance"')) {
        messageToSend = messageToSend + sensor2message + messageCloser;
    }
    else if(sensor2Type == -1 && (sensor1Type == '"touch"' || sensor1Type == '"distance"')){
        messageToSend = messageToSend + sensor1message + messageCloser;
    }else {
        messageToSend = messageToSend + sensor1message + ', ' + sensor2message + messageCloser;
        
    }

    connection.send(messageToSend);
    if(debugMode) {
        document.getElementById("testing3").innerHTML = messageToSend;
    }
    
    //test command below in case anything breaks
    //connection.send("{\"sensors\": [{\"name\":\"touch\", \"id\":0, \"value\":0}, {\"name\":\"distance\", \"id\":3, \"value\":12.8}]}");
}

function periodicMovement() { //every 250 milliseconds (.25 seconds) move the Robot
    //document.getElementById("testing").innerHTML = 'Current Motor States: Left Motor = ' + leftWheelPower + ' Right Motor' + rightWheelPower;
    if(debugMode) {
        document.getElementById("testing2").innerHTML = 'Current Motor States: Left Motor = ' + leftWheelPower + ' Right Motor' + rightWheelPower;
    }
    if(leftWheelPower == 0 && rightWheelPower == 0) {
        accuLeft = 0; 
        accuRight = 0;}
    accuLeft = accuLeft + leftWheelPower;
    accuRight = accuRight + rightWheelPower;
    if((accuLeft - accuRight) >= 12.5) {
        if(heading == 0) {
            //rotateIndicatorRight();
            heading = 3;
            swapDim();
            
        } else {
            /*if(heading == 1) rotateIndicatorFront();
            if(heading == 2) rotateIndicatorLeft();
            if(heading == 3) rotateIndicatorBack(); */
            heading--; 
            swapDim();
        }
        accuLeft = 0;
        accuRight = 0;
    } else if((accuRight - accuLeft) >= 12.5) { //turning left
        if(heading == 3) {
            //rotateIndicatorFront();
            heading = 0;
            swapDim();
        } //facing right
        else {
            
            //if(heading == 2) rotateIndicatorRight();
            //if(heading == 1) rotateIndicatorBack();
            //if(heading == 0) rotateIndicatorLeft();
            heading++;
            swapDim();
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
    WSsendSensorInfo();
    var t = setTimeout(periodicMovement, 40);
}


function getSensorInfo() {
    var NaNchecker = isNaN(document.getElementById("sensor1Txt").value) || isNaN(document.getElementById("sensor2Txt").value);
    var nullChecker =(document.getElementById("sensor1Txt").value == '' || document.getElementById("sensor2Txt").value == '');
    var noneChecker1 = (document.getElementById("sensor1Txt").value == 'none');
    var noneChecker2 = (document.getElementById("sensor2Txt").value == 'none');
    
    if((!NaNchecker && !nullChecker) || noneChecker1 || noneChecker2) { //if number or 'none'
        /*
         * sensorXType lookup: 
         * -1 = not used
         * 5 = ultrasonic
         * 10 = touch
         * 
         * ID# = ID# intended
         * 
         */
        if(noneChecker1) {
            sensor1Type = -1;
            sensor1ID = -1;
        } else {
            if(document.getElementById("sensor1Select").selectedIndex == 0 ){ //ultrasonic
                sensor1Type = '"distance"';
            } else {
                sensor1Type = '"touch"'; //touch
            }
            sensor1ID = parseInt(document.getElementById("sensor1Txt").value);
        }
        if(noneChecker2) {
            sensor2Type = -1;
            sensor2ID = -1;
        } else {
            if(document.getElementById("sensor2Select").selectedIndex == 0 ){ //ultrasonic
                sensor2Type = '"distance"';
            } else {
                sensor2Type = '"touch"'; //touch
            }
            sensor2ID = parseInt(document.getElementById("sensor2Txt").value);
        }
        document.getElementById("sensorLbl").innerHTML = "Sensor values assigned. (distance = ultra, touch = touch, -1 = not used) Sensor1 is of type " + sensor1Type + " with ID#: " + sensor1ID + " Sensor2 is of Type " + sensor2Type + " with ID#: " + sensor2ID 
        
    } //end outer if
    else {document.getElementById("sensorLbl").innerHTML = "Please input an integer for the sensor ID #s or put 'none' if not using";}
        

}

function startServer(){
    alert("Starting Server");
    var path;
    var hosts = ['localhost', '127.0.0.1'];
    //connect to VIPLE
    path = 'ws://' + document.getElementById('ipTxt').value + ':8124';
    if(document.getElementById('ipTxt').value == 'localdebug') {
        debugMode = true;
    }
    
    if(document.getElementById('ipTxt').value == 'localhost' || document.getElementById('ipTxt').value == 'localdebug') {
        for (var i in hosts) {
            path = 'ws://'+hosts[i]+':8124';
            console.log( '===> Tested path :: ', path );
            try {
                connection = new WebSocket( path );
                break;
            }
            catch ( e ) {
                // !!! Never shown !!!
                console.error( '===> WebSocket creation error :: ', e );
            }
        }
    }
    
    else { connection = new WebSocket(path);}
    
    
    connection.onopen = function(){
        if(debugMode) {
            document.getElementById("testing").innerHTML = 40;
        }
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

/*
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
                    
                    
*/