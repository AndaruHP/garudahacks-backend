const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/grade_controller");

router.post("/grade/create-grade", gradeController.createGrade);
router.get("/grade/get-grade/:user_id", gradeController.getGrade);

module.exports = router;
