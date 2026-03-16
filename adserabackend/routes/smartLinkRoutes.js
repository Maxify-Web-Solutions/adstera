const express = require("express");

const router = express.Router();

const smartLinkController = require("../controllers/smartLinkController");
const authMiddleware = require("../middleware/authMiddleware");



router.post("/create",authMiddleware,smartLinkController.createSmartLink);

router.get("/approve/:id",smartLinkController.approveSmartLink);

router.get("/s/:code",smartLinkController.redirectSmartLink);

module.exports = router;