const express = require("express");
const cors = require("cors");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();

app.use(cors({
  origin: "https://coupon-lead-management-system.vercel.app/"
}));

app.use(express.json());
app.use("/api", rateLimiter);

app.use("/api/coupon", require("./routes/couponRoutes"));
app.use("/api/lead", require("./routes/leadRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.listen(5000, () => console.log("Server running on 5000"));