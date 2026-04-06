const express = require("express");
const { verifyToken } = require("../Middlewares/Auth");
const WrapAsync = require("../Utils/WrapAsync");
const { getStudentsData, getStudentDetails, addStudent, getToken } = require("../Controllers/Student");
const router = express.Router();


router.get("/", verifyToken, WrapAsync(getStudentsData));
router.get("/:studentId", verifyToken, WrapAsync(getStudentDetails));
router.post("/", verifyToken, WrapAsync(addStudent));
router.get("/token/:idNumber", verifyToken, WrapAsync(getToken))

module.exports = router;