const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/grade_controller");
const controller = require("../controllers/index");

router.post("/grade/grade-quiz", controller.gradeController.gradeQuiz);
router.put("/grade/update-grade/:user_id/:materials_id", controller.gradeController.updateGradeQuiz);
// router.get("/grade/get-grade/:user_id", controller.gradeController.getGrade);
// router.get("/grade/user/:user_id", gradeController.getGradesByUser);
router.get(
  "/grade/user/:user_id/:materials_id",
  gradeController.getGradeByUserAndMaterial
);
router.get(
  "/grade/material/:materials_id",
  gradeController.getGradesByMaterial
);

module.exports = router;
