const auth = require("./auth_controller");
const subject = require("./subject_controller");
const materials = require("./materials_controller");
const gradeController = require("./grade_controller");
const video = require("./video_controller");

const controller = {};

controller.auth = auth;
controller.subject = subject;
controller.materials = materials;
controller.gradeController = gradeController;
controller.video = video;

module.exports = controller;
