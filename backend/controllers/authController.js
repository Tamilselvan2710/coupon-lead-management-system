const db = require("../config/db");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.execute(
    "SELECT * FROM admin_users WHERE email=?",
    [email]
  );

  if (!rows.length) {
    return res.json({ success: false, message: "User not found" });
  }

  const user = rows[0];

  if (user.password !== password) {
    return res.json({ success: false, message: "Invalid password" });
  }

  res.json({
    success: true,
    message: "Login successful",
  });
};