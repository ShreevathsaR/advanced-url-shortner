const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const session = require("express-session");
const cors = require('cors')

app.use(cors())

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const shortenUrlRoutes = require("./routes/urlRoutes");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

dotenv.config();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose
.connect(process.env.MONGO_URI)
  .then(() => {
      console.log("Connected to MongoDB");
    })
  .catch((err) => {
    console.log(err);
});

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
    })
);


app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use(dashboardRoutes);
app.use(shortenUrlRoutes)

app.get("/", (req, res) => {
  res.send("This works!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
