const express = require("express");

const router = express.Router();

const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// Create
router.post("/", createContact);

// Get All
router.get("/", getAllContacts);

// Get Single
router.get("/:id", getContactById);

// Update
router.put("/:id", updateContact);

// Delete
router.delete("/:id", deleteContact);

module.exports = router;