const express = require("express");
const router = express.Router();
const mathVideoController = require("../controllers/math_video_controller");

router.post("/math-video/create", mathVideoController.createMathVideo);
router.get("/math-video/user/:user_id", mathVideoController.getUserVideos);
router.get("/math-video/:video_id", mathVideoController.getVideoById);

module.exports = router;
