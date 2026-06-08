require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const smartLinkRoutes = require("./routes/smartLinkRoutes");
const adsterraRoutes = require("./routes/adsterraroutes");
const adsterraPlacementRoutes = require("./routes/adsterraPlacementRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const userMonthlyStatsRoutes = require("./routes/userMonthlyStatsRoutes");
const statsConfigRoutes = require("./routes/statsConfigRoutes");
require("./cron/userMonthlyStatsCron");
const websiteRoutes = require("./routes/websiteRoutes");
const calculatedWebsiteRoutes = require("./routes/calculatedWebsiteRoutes");
const contactRoutes = require("./routes/contactRoutes");

const connectDB = require("./config/connectdb");

const dns = require("dns");
const path = require("path");
// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const { calculateAndStoreAdsterraStats, calculateAndStoreSmartLinkStats,calculateAndStoreWebsiteStats } = require("./controllers/calculateAndStoreAdsterraStats");
const { RawfetchAndStoreAdsterraStats, RawfetchAndStoreCountryStats, RawFetchAndStoreWebsiteStats } = require("./controllers/Rawcontroller");



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

app.use("/api/withdrawal", withdrawalRoutes);
app.use('/', require('./controllers/redirectLink.controller'))
app.use("/api/monthly-stats", userMonthlyStatsRoutes);
app.use("/api/stats-config", statsConfigRoutes);
app.use("/api/website", websiteRoutes);
app.use("/api", calculatedWebsiteRoutes);
app.use("/api/contact", contactRoutes);




app.use(express.static(path.join(__dirname, "../App/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../App/dist/index.html"));
});


// RawfetchAndStoreAdsterraStats()
// calculateAndStoreAdsterraStats()

// RawfetchAndStoreCountryStats();

// calculateAndStoreSmartLinkStats()

// RawFetchAndStoreWebsiteStats();


// calculateAndStoreWebsiteStats();


connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});