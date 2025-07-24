const express = require("express");
const router = express.Router();
const materialsController = require("../controllers/materials_controller");

router.post(
  "/materials/post-material",
  materialsController.createMaterialsWithQuiz
);
router.get("/materials/get-materials", materialsController.getMaterials);
router.get("/materials/get-material/:id", materialsController.getMaterial);
router.get(
  "/materials/get-materials-by-subject/:subject_id",
  materialsController.getMaterialsBySubject
);

module.exports = router;
