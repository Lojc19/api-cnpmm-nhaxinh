const express = require("express");
const { createRoom, getaRoom, getallRoom} = require("../controllers/room.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/create-room",authMiddleware, isAdmin, createRoom);

router.get("/getCateByRoom/:id", getaRoom);

router.get("/getallRoom", getallRoom);

module.exports = router;