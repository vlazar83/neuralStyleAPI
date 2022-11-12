const { spawn } = require("child_process");
const { PythonShell } = require("python-shell");
const uuid = require("uuid");

var express = require("express");
var router = express.Router();
let constants = require("../utils/const.js").constants;
let errorCodes = require("../utils/errorCodes.js").errorCodes;

var multer = require("multer");
let fileFilter = function (req, file, cb) {
  var allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      {
        success: false,
        message: "Invalid file type. Only jpg, png image files are allowed.",
      },
      false
    );
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/in");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    if (file.mimetype === "image/jpg") {
      filetype = "jpg";
    }
    cb(null, file.originalname);
  },
  fileFilter: fileFilter,
});

var upload = multer({
  storage: storage,
  limits: { fileSize: constants.MAXFILESIZE },
}).array("files", constants.NUMBER_OF_ACCEPTED_FILES);

router.post("/transfer", async (req, res) => {
  console.log("num_iterations URL param:" + req.query.num_iterations);
  var count = await countNrOfPytonProcesses();
  if (parseInt(count) !== constants.MAX_NUMBER_OF_RUNNING_BACKGROUND_PROCESSES) {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(400);
        if (err.code == errorCodes.LIMIT_UNEXPECTED_FILE) {
          res.send({
            errorCode: errorCodes.LIMIT_UNEXPECTED_FILE_ERROR_CODE,
            error: errorCodes.LIMIT_UNEXPECTED_FILE_ERROR_MESSAGE,
          });
        } else if (err.code == errorCodes.LIMIT_FILE_SIZE) {
          res.send({
            errorCode: errorCodes.LIMIT_FILE_SIZE_ERROR_CODE,
            error: errorCodes.LIMIT_FILE_SIZE_ERROR_MESSAGE,
          });
        } else {
          res.send(err);
        }
      } else if (err) {
        // An unknown error occurred when uploading.
        res.status(500);
        res.send(err);
      } else {
        // check if we received constants.NUMBER_OF_ACCEPTED_FILES files
        if (req.files.length != constants.NUMBER_OF_ACCEPTED_FILES) {
          res.status(400);
          res.json({
            errorCode: errorCodes.INCORRECT_AMOUNT_OF_FILES_ERROR_CODE,
            error: errorCodes.INCORRECT_AMOUNT_OF_FILES_ERROR_MESSAGE,
          });
        } else {
          // Everything went fine.
          console.log(req.files);
          var response = await createOutFolder();
          console.log("Created folder: " + response.uuid);

          var moveResponse = await moveNewFilesToInFolder(response.uuid, req.files[0].filename, req.files[1].filename);
          console.log("Files were moved successfully: " + response.success);

          var responseFileUrl = "http://localhost:3000/images/out/" + response.uuid + "/out.png";
          startNeuralTransfer(req.files[0].filename, req.files[1].filename, response.uuid, req.query.num_iterations);
          res.json({ fileUrl: responseFileUrl });
        }
      }
    });
  } else {
    res.status(529); // Site is overloaded
    res.statusMessage =
      "The maximum amount of server side running background processes reached. Please try again later.";
    res.send("The maximum amount of server side running background processes reached. Please try again later.");
  }
});

let startNeuralTransfer = function (fileName1, fileName2, uuid, num_iterations) {
  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "script",
    args: [
      "-style_image",
      "public/images/in/" + uuid + "/" + fileName1,
      "-content_image",
      "public/images/in/" + uuid + "/" + fileName2,
      "-output_image",
      "public/images/out/" + uuid + "/" + "out.png",
      "-gpu=c",
      "-num_iterations=" + num_iterations,
    ],
  };

  return new Promise((resolve, reject) => {
    try {
      PythonShell.run("neural_style.py", options, function (err, result) {
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        console.log("result: ", result.toString());
        //result.send(result.toString());
        resolve({ success: true, result });
      });
    } catch {
      console.log("error running python code");
      reject();
    }
  });
};

let createOutFolder = function () {
  var generatedUUID = uuid.v4();
  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "script",
    args: ["-name", generatedUUID],
  };

  return new Promise((resolve, reject) => {
    try {
      PythonShell.run("create_out_folder.py", options, function (err, result) {
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        // console.log("result: ", result.toString());
        //result.send(result.toString());
        resolve({ uuid: generatedUUID, success: true, result });
      });
    } catch {
      console.log("error running python code");
      reject();
    }
  });
};

let moveNewFilesToInFolder = function (folderName, file1Name, file2Name) {
  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "script",
    args: ["-folderName", folderName, "-file1Name", file1Name, "-file2Name", file2Name],
  };

  return new Promise((resolve, reject) => {
    try {
      PythonShell.run("move_new_files_into_in_folder.py", options, function (err, result) {
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        // console.log("result: ", result.toString());
        //result.send(result.toString());
        resolve({ success: true, result });
      });
    } catch {
      console.log("error running python code");
      reject();
    }
  });
};

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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET currently running number of python processes */
router.get("/pythonNr", async function (req, res, next) {
  var count = await countNrOfPytonProcesses();
  res.json(count);
});

module.exports = router;
