const db = require("../config/db");

exports.submitLead = async (req, res) => {
  const d = req.body;

  try {
    const [existing] = await db.execute(
      `SELECT id FROM leads 
       WHERE (phone = ? OR email = ?) 
       AND created_at >= NOW() - INTERVAL 5 MINUTE`,
      [d.phone, d.email]
    );

    if (existing.length > 0) {
      return res.json({
        success: false,
        message: "You have already submitted recently. Please try again later.",
      });
    }

    await db.execute(
      `INSERT INTO leads 
      (name, phone, email, city, requirement_type, budget_range, message, coupon_code, discount_amount, final_price, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        d.name,
        d.phone,
        d.email,
        d.city,
        d.requirement_type,
        d.budget_range,
        d.message,
        d.coupon_code,
        d.discount_amount,
        d.final_price,
      ]
    );

    if (d.coupon_code) {
      await db.execute(
        `UPDATE coupons 
         SET used_count = used_count + 1 
         WHERE code = ?`,
        [d.coupon_code]
      );
    }

    res.json({ success: true, message: "Lead submitted successfully" });

  } catch (err) {
    console.error("Submit Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM leads ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ success: false });
  }
};