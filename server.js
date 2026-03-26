const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create table automatically
pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    deadline DATE,
    status TEXT,
    category TEXT
  );
`)
.then(() => console.log("Table ready"))
.catch(err => console.error(err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ ADD new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, deadline, category } = req.body;

    const newTask = await pool.query(
      "INSERT INTO tasks (title, deadline, status, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, deadline, "Pending", category]
    );

    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ DELETE task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

    res.json("Task deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ UPDATE task status
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2",
      ["Completed", id]
    );

    res.json("Task updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});