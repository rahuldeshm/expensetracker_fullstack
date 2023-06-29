const express = require("express");

const auth = require("../controllers/auth");
const forgot = require("../controllers/forgot");

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/signin", auth.signin);
router.post("/forgot", forgot.forgot);
router.get("/resetpasspage/:resetId", forgot.resetpasspage);
router.post("/resetpass", forgot.resetpass);

module.exports = router;
