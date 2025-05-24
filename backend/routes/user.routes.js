const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const verifyAdmin = require("../middleware/verifyAdmin");

router.get("/", verifyAdmin, getAllUsers);
router.get("/:id", verifyAdmin, getUserById);
router.post("/", verifyAdmin, createUser);
router.put("/:id", verifyAdmin, updateUser);
router.delete("/:id", verifyAdmin, deleteUser);

module.exports = router;
