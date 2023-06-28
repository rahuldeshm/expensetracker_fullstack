const express = require("express");

const auth = require("../controllers/auth");
const forgot = require("../controllers/forgot");

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/signin", auth.signin);
router.post("/forgot", forgot.forgot);

module.exports = router;
