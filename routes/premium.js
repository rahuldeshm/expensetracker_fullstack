const express = require("express");
const authenticate = require("../middleware/auth");
const premium = require("../controllers/premium");

const router = express.Router();

router.get("/leaderboard", authenticate, premium.getLeaderboard);

router.get("/download", authenticate, premium.getDownload);
module.exports = router;
