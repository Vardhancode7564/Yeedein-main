const express = require("express");
const router = express.Router();
const { signup, signin, refreshToken, addverifier } = require("../Controllers/Auth");
const WrapAsync = require("../Utils/WrapAsync");
const { verifyToken } = require("../Middlewares/Auth");

router.post("/addverifier", verifyToken, WrapAsync(addverifier));
router.post("/signup", WrapAsync(signup));
router.post("/signin", WrapAsync(signin));
router.post("/refreshToken", verifyToken, WrapAsync(refreshToken));

module.exports = router;
