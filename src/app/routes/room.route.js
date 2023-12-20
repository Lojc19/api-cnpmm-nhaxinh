const express = require("express");
const { createRoom, getaRoom, getallRoom, updateRoom, deleteRoom} = require("../controllers/room.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/create-room",authMiddleware, isAdmin, createRoom);

router.get("/getCateByRoom/:id", getaRoom);

router.put("/:_id",authMiddleware, isAdmin, updateRoom);

router.delete("/:_id",authMiddleware, isAdmin, deleteRoom);

router.get("/all", getallRoom);

module.exports = router;