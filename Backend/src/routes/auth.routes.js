const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = Router();
/**
 *  @Route POST api/auth/register
 */
router.post("/register", authController.registerUser);
/**
 *  @Route POST api/auth/login
 */
router.post("/login", authController.loginUser);

/**
 * @Route GET api/auth/get-me
 */
router.get("/get-me", authMiddleware.authUser, authController.getMe);
/**
 * @Route GET api/auth/logout
 */
router.get("/logout", authController.logOutUser);
module.exports = router;
