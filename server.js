import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect DB
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "yourdb"
});

// Signup route (save user)
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  await db.query("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, hash]);
  res.json({ message: "User created" });
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (rows.length === 0) return res.status(400).json({ error: "User not found" });

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: "1h" });
  res.json({ message: "Login success", token });
});

app.listen(5000, () => console.log("Server running on port 5000"));