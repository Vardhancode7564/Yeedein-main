const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path")


dotenv.config();
connectDB();

const app = express();

app.use(express.static(path.join(__dirname, "/dist")));

app.use(express.json());

const authRouter = require("./Routers/Auth");
const scannerRouter = require("./Routers/Scanner");
const studentRouter = require("./Routers/Student");


app.get("/", (req, res) => {
  res.json({ message: "Welcome EconNest" });
});

// Routes
app.use("/api/auth",authRouter);
app.use("/api/scanner", scannerRouter);
app.use("/api/student", studentRouter);

//client rendering
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});



app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let { status = 500, message = "some error" } = err;
  res.status(status).json({ message});
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
