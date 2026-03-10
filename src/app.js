const helmet = require("helmet");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const companyRoute = require("./routes/company.route.js");
const userRoute = require("./routes/user.route.js");
const jobRoute = require("./routes/job.route.js");
const applicationRoute = require("./routes/application.route.js");

const errorMiddleware = require("./middlewares/errorMiddleware.js");
const AppError = require("./utils/appError.js");

dotenv.config();

const app = express();

app.use(morgan("dev"));

app.use(helmet());

app.use(
  cors({
    origin: "https://hirehorizonfrontendsystem.vercel.app/",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/home", (req, res) => {
  res.status(200).json({
    message: "I am coming from backend",
    success: true
  });
});

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorMiddleware);

module.exports = app;