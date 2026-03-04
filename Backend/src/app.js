const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/**
 * @Routes api/auth
 */
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

/**
 *  @Routes api/songs
 */
const songRoutes = require("./routes/song.routes");
app.use("/api/songs", songRoutes);

module.exports = app;
