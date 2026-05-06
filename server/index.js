const express = require("express");
const cors = require("cors");
const zxcvbn = require("zxcvbn");
const bcrypt = require("bcrypt");
const helmet = require("helmet");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(helmet());

const commonPasswords = [
  "123456",
  "password",
  "qwerty",
  "admin",
  "welcome"
];

app.post("/analyze", async (req, res) => {

  const { password } = req.body;

  const result = zxcvbn(password);

  const isCommon = commonPasswords.includes(password);

  const hashedPassword = await bcrypt.hash(password, 10);

  let securityLevel = "";

  if (result.score <= 1) {
    securityLevel = "Weak";
  } else if (result.score <= 3) {
    securityLevel = "Medium";
  } else {
    securityLevel = "Strong";
  }

  res.json({
    strength: securityLevel,
    score: result.score,
    entropy: result.guesses_log10,
    crackTime: result.crack_times_display.offline_fast_hashing_1e10_per_second,
    suggestions: result.feedback.suggestions,
    warning: result.feedback.warning,
    commonPassword: isCommon,
    hashedPassword
  });
});

app.listen(5000, () => {
  console.log("Cybersecurity Server Running");
});