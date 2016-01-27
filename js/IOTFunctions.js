
var connection;
function popup(){
    alert("Hello World");
}
function startServer(){
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
        up();
        
        move();
    }
    
    checker = checker+1;
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
                    
                    
                
     