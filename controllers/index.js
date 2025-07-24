const auth = require("./auth_controller");
const subject = require("./subject_controller");

const controller = {};

controller.auth = auth;
controller.subject = subject;

module.exports = controller;
