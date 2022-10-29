"use strict";

let constants = require("../utils/const.js").constants;

module.exports = {
  errorCodes: {
    LIMIT_UNEXPECTED_FILE: "LIMIT_UNEXPECTED_FILE",
    LIMIT_UNEXPECTED_FILE_ERROR_CODE: "1",
    LIMIT_UNEXPECTED_FILE_ERROR_MESSAGE:
      "The number of uploaded files should be equal: " +
      constants.NUMBER_OF_ACCEPTED_FILES,
    LIMIT_FILE_SIZE: "LIMIT_FILE_SIZE",
    LIMIT_FILE_SIZE_ERROR_CODE: "2",
    LIMIT_FILE_SIZE_ERROR_MESSAGE:
      "The uploaded file size can be maximum (bytes): " + constants.MAXFILESIZE,
    INCORRECT_AMOUNT_OF_FILES_ERROR_CODE: "3",
    INCORRECT_AMOUNT_OF_FILES_ERROR_MESSAGE:
      "The number of uploaded files are not correct.Please provide " +
      constants.NUMBER_OF_ACCEPTED_FILES +
      " files next time.",
    //key3: {
    //  subkey1: "subvalue1",
    //  subkey2: "subvalue2",
    //},
  },
};
