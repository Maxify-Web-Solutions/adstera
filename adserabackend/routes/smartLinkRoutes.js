const express = require("express");
const router = express.Router();

const smartLinkController = require("../controllers/smartLinkController");
const authMiddleware = require("../middleware/authMiddleware");


// ================= USER =================

// ✅ Create smart link
router.post("/create", authMiddleware, smartLinkController.createSmartLink);

// ✅ Get logged-in user's links
router.get("/my-links", authMiddleware, smartLinkController.getSmartLinksByUser);


// ================= ADMIN =================

// ✅ Approve link
router.put("/approve/:id", smartLinkController.approveSmartLink);


// ================= EXTERNAL SYSTEM =================

router.post("/update-data", smartLinkController.updateSmartLinkData);


// ================= STATS =================


router.get("/smartlink-stats",authMiddleware, smartLinkController.getSmartLinkStats);


// ================= PUBLIC =================



module.exports = router;