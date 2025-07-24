const express = require("express");
const router = express.Router();
// const gradeController = require("../controllers/grade_controller");
const controller = require("../controllers/index");

router.post("/grade/create-grade", controller.gradeController.createGrade);
router.get("/grade/get-grade/:user_id", controller.gradeController.getGrade);

module.exports = router;
