const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Get all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Add task
app.post("/tasks", (req, res) => {
  const { title, deadline, category } = req.body;

db.query(
  "INSERT INTO tasks (title, deadline, status, category) VALUES (?, ?, 'Pending', ?)",
  [title, deadline, category],
    (err) => {
      if (err) throw err;
      res.send("Task Added");
    }
  );
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  db.query("DELETE FROM tasks WHERE id=?", [req.params.id], (err) => {
    if (err) throw err;
    res.send("Task Deleted");
  });
});

// Mark complete
app.put("/tasks/:id", (req, res) => {
  db.query(
    "UPDATE tasks SET status='Completed' WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) throw err;
      res.send("Task Updated");
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});