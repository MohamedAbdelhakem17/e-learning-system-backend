const express = require("express");

const protect = require("../middleware/protectMiddleware");
const SocialMediaController = require("../controller/SocialMediaController");

const router = express.Router();

router
    .route("/")
    .get(protect, SocialMediaController.getLoggedUserSocialMediaLinks);

router
    .route("/:linkId")
    .post(protect, SocialMediaController.addSocialMediaLink)
    .put(protect, SocialMediaController.updateSocialMediaLink)
    .delete(protect, SocialMediaController.removeSocialMediaLink);

module.exports = router;
