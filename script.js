const API = "https://study-planner-f9ph.onrender.com/tasks"; // 🔁 replace if your URL is different

// Load tasks on page load
window.onload = loadTasks;

// 📥 Load all tasks
async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${task.title}</strong> 
      | ${task.deadline} 
      | ${task.category || "General"} 
      | ${task.status}
      <br>
      <button onclick="completeTask(${task.id})">✔ Complete</button>
      <button onclick="deleteTask(${task.id})">❌ Delete</button>
    `;

    taskList.appendChild(li);
  });
}

// ➕ Add new task
async function addTask() {
  const title = document.getElementById("taskInput").value;
  const deadline = document.getElementById("deadlineInput").value;
  const category = document.getElementById("categoryInput").value;

  if (!title || !deadline) {
    alert("Please enter task and deadline");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      deadline,
      category
    })
  });

  // Clear inputs
  document.getElementById("taskInput").value = "";
  document.getElementById("deadlineInput").value = "";
  document.getElementById("categoryInput").value = "";

  loadTasks();
}

// ❌ Delete task
async function deleteTask(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  loadTasks();
}

// ✔ Mark complete
async function completeTask(id) {
  await fetch(`${API}/${id}`, {
    method: "PUT"
  });

  loadTasks();
}