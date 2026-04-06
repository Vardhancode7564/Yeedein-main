const { decrypt, encrypt } = require("../Encryption/Encrypt");
const Student = require("../Modals/Student");
const ExpressError = require("../Utils/ExpessError");

module.exports.getStudentsData = async (req, res) => {

  const allStudents = await Student.find();

  const generateStats = (students) => {
    const total = students.length;
    const checkIn = students.filter((s) => s.isCheckIn).length;
    const notCheckIn = total - checkIn;

    const takenFood = students.filter((s) => s.isTakenFood).length;
    const notTakenFood = total - takenFood;

    const takenIcecream = students.filter((s) => s.isTakenIcecream).length;
    const notTakenIcecream = total - takenIcecream;

    const completedAll = students.filter(
      (s) => s.isCheckIn && s.isTakenFood && s.isTakenIcecream
    ).length;

    const missingAny = total - completedAll;

    return {
      total,
      checkIn,
      notCheckIn,
      takenFood,
      notTakenFood,
      takenIcecream,
      notTakenIcecream,
      completedAll,
      missingAny,
    };
  };

  const e3Stats = generateStats(allStudents.filter((s) => s.year === "E3"));
  const e4Stats = generateStats(allStudents.filter((s) => s.year === "E4"));
  const overallStats = generateStats(allStudents);

  res.status(200).json({
    E3: e3Stats,
    E4: e4Stats,
    overall: overallStats,
  });
};

module.exports.getStudentDetails = async (req, res) => {
  const studentId = req.params.studentId;
  if (!studentId) {
    throw new ExpressError(404, "Student Token is missing");
  }

  const id = decrypt(studentId);

  if (!id) {
    throw new ExpressError(404, "ID not found");
  }

  const student = await Student.findById(id)
    .populate({
      path: "checkInScannedBy",
      select: "email", // Only select the 'email' field from this populated document
    })
    .populate({
      path: "foodScannedBy",
      select: "email", // Only select the 'email' field from this populated document
    })
    .populate({
      path: "iceCreamScannedBy",
      select: "email", // Only select the 'email' field from this populated document
    });
  
  if (!student) {
    throw new ExpressError(404, "ID not found");
  }

 

  res.status(200).json(student);
};


module.exports.addStudent = async (req, res) => {
  const { email, idNumber, year } = req.body;
  const student = new Student({ email: email, idNumber: idNumber, year: year });
  const savedStudent = await student.save();

  const token = encrypt(savedStudent._id);

  res.status(200).json({message:"Student is Created", token: token})
}

module.exports.getToken = async (req, res) => {
  const idNumber = req.params.idNumber;
  const student = await Student.findOne({ idNumber: idNumber }).select("idNumber year email");
  if (!student) {
    throw new ExpressError(404, "Student Not found");
  }

  const token = encrypt(student._id);

  res.status(200).json({ token: token, student: student });
}