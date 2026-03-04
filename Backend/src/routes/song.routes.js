const express = require("express");
const upload = require("../middleware/upload.middleware");
const songController = require("../controllers/song.controller")

const router = express.Router();

/**
 *  @route /api/songs/
 */
router.post("/",upload.single("song"),songController.uploadSong)

/**
 *  @route /api/songs/
 */
router.get("/",songController.getSong)

module.exports = router;
