const auth = require("./auth_controller");
const subject = require("./subject_controller");
const materials = require("./materials_controller");

const controller = {};

controller.auth = auth;
controller.subject = subject;
controller.materials = materials;

module.exports = controller;
