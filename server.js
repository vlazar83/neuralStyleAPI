#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("./app");
var debug = require("debug")("neuralstyleapi:server");
var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
  debug("Listening on " + bind);
}

// monitoring

var io = require('socket.io')(9500);
var osm = require("os-monitor");
//var process = require('node:process');

io.on('connect', function (socket) {
  //var count = await countNrOfPytonProcesses();
    socket.emit('connected', {
        status: 'connected',
        type: osm.os.arch(), 
        cpus: osm.os.cpus(),
        freemem: osm.os.freemem(),
        resource: process.resourceUsage(),
        pythonCount: 2,
    });
});

io.on('disconnect', function (socket) {
    socket.emit('disconnected');
});


osm.start({
    delay: 3000 // interval in ms between monitor cycles
    , stream: false // set true to enable the monitor as a Readable Stream
    , immediate: false // set true to execute a monitor cycle at start()
}).pipe(process.stdout);


// define handler that will always fire every cycle
osm.on('monitor', function (monitorEvent) {
    io.emit('os-update', monitorEvent);
});

let countNrOfPytonProcesses = function () {
  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "script",
    args: [],
  };

  return new Promise((resolve, reject) => {
    try {
      PythonShell.run("count_python_processes.py", options, function (err, result) {
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        // console.log("result: ", result.toString());
        //result.send(result.toString());
        resolve(result[0]);
      });
    } catch {
      console.log("error running count_python_processes.py code");
      reject();
    }
  });
};