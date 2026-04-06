const express = require("express");
const { verifyToken } = require("../Middlewares/Auth");
const WrapAsync = require("../Utils/WrapAsync");
const { checkInStudent, scanFood, scanIceCream } = require("../Controllers/Scanner");
const router = express.Router();


router.patch("/checkIn", verifyToken, WrapAsync(checkInStudent));
router.patch("/scanfood", verifyToken, WrapAsync(scanFood));
router.patch("/scanicecream", verifyToken, WrapAsync(scanIceCream));

module.exports = router;