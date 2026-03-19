require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const smartLinkRoutes = require("./routes/smartLinkRoutes");
const adsterraRoutes = require("./routes/adsterraroutes");
const adsterraPlacementRoutes = require("./routes/adsterraPlacementRoutes");

const connectDB = require("./config/connectdb");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/smartlink", smartLinkRoutes);
app.use("/api/adsterra", adsterraRoutes);
app.use("/api", adsterraPlacementRoutes);



connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});