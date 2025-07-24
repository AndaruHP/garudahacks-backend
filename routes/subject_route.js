const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

// Signup
// router.get("/signup", controller.auth.testingauth);
// router.post("/signup", controller.auth.signup);

router.get("/subject/get-subjects", controller.subject.GetSubjects);
router.post("/subject/post-subject", controller.subject.CreateSubject);
router.get("/subject/get-subject/:id", controller.subject.GetSubject);
router.get(
  "/subject/get-subjects-by-class/:classNumber",
  controller.subject.GetSubjectsByClass
);

module.exports = router;
