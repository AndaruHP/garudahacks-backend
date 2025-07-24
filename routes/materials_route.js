const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.post("/materials/post-ai", controller.materials.createMaterialsWithAI);

router.post(
  "/materials/post-material",
  controller.materials.createMaterialsWithQuiz
);
router.get("/materials/get-materials", controller.materials.getMaterials);
router.get("/materials/get-material/:id", controller.materials.getMaterial);
router.get(
  "/materials/get-materials-by-subject/:subject_id",
  controller.materials.getMaterialsBySubject
);

module.exports = router;
