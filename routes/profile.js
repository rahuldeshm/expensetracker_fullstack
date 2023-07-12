const express = require("express");
const authenticate = require("../middleware/auth");
const profile = require("../controllers/profile");
const verify = require("../controllers/verify");

const router = express.Router();

router.post("/update", authenticate, profile.updateProfile);
router.post("/verify", authenticate, verify.verify);
router.get("/verifyemail/:resetId", verify.verifyemail);
router.post("/verifyemailfinal", verify.verifyemailfinal);
module.exports = router;
