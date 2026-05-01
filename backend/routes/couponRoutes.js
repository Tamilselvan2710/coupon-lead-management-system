const router = require("express").Router();
const { applyCoupon } = require("../controllers/couponController");

router.post("/apply", applyCoupon);

module.exports = router;