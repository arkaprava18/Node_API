import express from "express";
import mysql from "mysql2/promise";

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MySQL
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mysql_db",
});

console.log("MySQL Connected Successfully");

// GET all users
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new user
app.post("/users", async (req, res) => {
  const { username, email } = req.body;
  try {
    await db.execute("INSERT INTO users (username, email) VALUES (?, ?)", [
      username,
      email,
    ]);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const [result] = await db.execute(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
