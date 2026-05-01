const db = require("../config/db");

exports.applyCoupon = async (req, res) => {
  const { code, price, requirementType } = req.body;

  const [rows] = await db.execute("SELECT * FROM coupons WHERE code=?", [code]);

  if (!rows.length)
    return res.json({ success: false, message: "Invalid coupon" });

  const c = rows[0];

  if (new Date(c.expiry_date) < new Date())
    return res.json({ success: false, message: "Expired" });

  if (c.used_count >= c.usage_limit)
    return res.json({ success: false, message: "Limit reached" });

  if (c.applicable_type && c.applicable_type !== requirementType)
    return res.json({ success: false, message: "Not applicable" });

  if (price < c.min_order_value)
    return res.json({ success: false, message: "Min value not met" });

  const discount =
    c.type === "PERCENT"
      ? (price * c.value) / 100
      : c.value;

  res.json({
    success: true,
    discount,
    finalPrice: price - discount,
  });
};