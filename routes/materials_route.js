const express = require("express");
const router = express.Router();
const materialsController = require("../controllers/materials_controller");

router.post(
  "/materials/post-material",
  materialsController.createMaterialsWithQuiz
);

module.exports = router;
