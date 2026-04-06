const Admin = require("../Modals/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = require("../Utils/ExpessError");

module.exports.signup = async (req, res) => {
  const { email, password, category } = req.body;
  // if (req.adminCategory !== "Admin") {
  //   throw new ExpressError(404, "You are not admin to add people");
  // }
  const exists = await Admin.findOne({ email });
  if (exists) {
    throw new ExpressError(404, "Admin Already Exist");
  }

  // if (category === "Admin") {
  //   throw new ExpressError(404, "There is already an Admin");
  // }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ email, password: hashedPassword, category: category });
  await newAdmin.save();
 

  res.status(200).json({ message: "Verifier Added" });
  
};

module.exports.addverifier = async (req, res) => {
  const { email, password, category } = req.body;
  if (req.adminCategory !== "Admin") {
    throw new ExpressError(404, "You are not admin to add people");
  }
  const exists = await Admin.findOne({ email });
  if (exists) {
    throw new ExpressError(404, "Admin Already Exist");
  }

  if (category === "Admin") {
    throw new ExpressError(404, "There is already an Admin");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ email, password: hashedPassword, category: category });
  await newAdmin.save();
 

  res.status(200).json({ message: "Verifier Added" });
  
};


module.exports.signin = async (req, res) => {
  const { email, password } = req.body;
  let admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ExpressError(401, "Invalid Email");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ExpressError(401, "Password Missmatch");
  }

  

  const token = jwt.sign({ id: admin._id,  category: admin.category }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  admin = await Admin.findById(admin._id).select("-password");

  res.status(200).json({user:admin, token:token });
};


module.exports.refreshToken = async (req, res) => {
  const adminId = req.adminId;
  if (!adminId) {
    throw new ExpressError(404, "Admin Not found");
  }

  const admin = await Admin.findById(adminId).select("-password");
  if (!admin) {
    throw new ExpressError(404, "Admin not found");
  }

  const token = jwt.sign({ id: admin._id, category:admin.category }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({user: admin, token: token });

}