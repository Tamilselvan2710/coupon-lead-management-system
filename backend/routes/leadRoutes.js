const router = require("express").Router();
const {
  submitLead,
  getLeads,
} = require("../controllers/leadController");

router.post("/submit", submitLead);
router.get("/", getLeads);

module.exports = router;