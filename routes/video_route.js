const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.get("/video/get-videos", controller.video.getVideos);
router.get("/video/get-video/:id", controller.video.getVideo);

router.post("/video/post-video", controller.video.createVideo);

module.exports = router;
