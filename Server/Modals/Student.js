const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  email: {
    type: String,
    reqired: true,
    unique: true,
  },
  idNumber: {
    type: String,
    reqired: true,
    unique: true,
  },
  year: {
    type: String,
    reqired: true,
    enum: ["E3", "E4"],
  },
  isCheckIn: {
    type: Boolean,
    reqired: true,
    default: false,
  },
  checkInTime: {
    type: Date,
    default: null,
  },
  checkInScannedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    default:null
  },
  isTakenFood: {
    type: Boolean,
    reqired: true,
    default: false,
  },
  foodTakenAt: {
    type: Date,
    default: null,
  },
  foodScannedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    default:null
  },
  isTakenIcecream: {
    type: Boolean,
    reqired: true,
    default: false,
  },
  iceCreamTakenAt: {
    type: Date,
    default: null,
  },
  iceCreamScannedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    default:null
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
