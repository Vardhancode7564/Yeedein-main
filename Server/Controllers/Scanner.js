const { decrypt } = require("../Encryption/Encrypt");
const Student = require("../Modals/Student");
const ExpressError = require("../Utils/ExpessError");

module.exports.checkInStudent = async (req, res) => {
  const token = req.body.token;
  if (!(req.adminCategory === "Admin" || req.adminCategory === "CheckIn")) {
    throw new ExpressError(404, "You have no Access to CheckIn Students");
  }
  if (!token) {
    throw new ExpressError(404, "Token not found");
  }

  const decryptedData = decrypt(token);

  const student = await Student.findById(decryptedData);

  if (!student) {
    throw new ExpressError(404, "Student Not found");
  }

  if (student.isCheckIn) {
    throw new ExpressError(409, `${student.idNumber} is Already Checked In`);
  }

  student.isCheckIn = true;
  student.checkInTime = Date.now();
  student.checkInScannedBy = req.adminId;
  await student.save();

  res
    .status(200)
    .json({ message: `${student.idNumber} is CheckedIn Successfully` });
};

module.exports.scanFood = async (req, res) => {
  const token = req.body.token;
  if (!(req.adminCategory === "Admin" || req.adminCategory === "Food")) {
    throw new ExpressError(404, "You have no Access to Scan Food");
  }

  if (!token) {
    throw new ExpressError(404, "Token not found");
  }

  const decryptedData = decrypt(token);

  const student = await Student.findById(decryptedData);

  if (!student) {
    throw new ExpressError(404, "Student Not found");
  }

  if (!student.isCheckIn) {
    throw new ExpressError(409, `${student.idNumber} is Not CheckedIn`);
  }
  if (student.isTakenFood) {
    throw new ExpressError(409, `${student.idNumber} Already taken Food`);
  }

  student.isTakenFood = true;
  student.foodTakenAt = Date.now();
  student.foodScannedBy = req.adminId;
  await student.save();

  res
    .status(200)
    .json({ message: `${student.idNumber} Food Scan Successfull` });
};

module.exports.scanIceCream = async (req, res) => {
  const token = req.body.token;
  if (!(req.adminCategory === "Admin" || req.adminCategory === "IceCream")) {
    throw new ExpressError(404, "You have no Access to Scan Icecream");
  }

  if (!token) {
    throw new ExpressError(404, "Token not found");
  }

  const decryptedData = decrypt(token);

  const student = await Student.findById(decryptedData);

  if (!student) {
    throw new ExpressError(404, "Student Not found");
  }

  if (!student.isCheckIn) {
    throw new ExpressError(409, "Student Not CheckedIn");
  }
  if (student.isTakenIcecream) {
    throw new ExpressError(
      409,
      `${student.idNumber} Already taken Ice Cream  `
    );
  }

  student.isTakenIcecream = true;
  student.iceCreamTakenAt = Date.now();
  student.iceCreamScannedBy = req.adminId;
  await student.save();

  res
    .status(200)
    .json({ message: `${student.idNumber} Icecream scan Successfull` });
};
