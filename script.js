const API = "https://study-planner-f9ph.onrender.com/tasks";

function fetchTasks() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";

      let completed = 0;

      data.forEach(task => {
        if (task.status === "Completed") completed++;

        const li = document.createElement("li");

        let today = new Date().toISOString().split("T")[0];
        let warning = task.deadline < today ? "overdue" : "";

      li.innerHTML = `
  <div class="task-info">
    <strong>${task.title}</strong>
    <small>
      ${task.deadline} | ${task.status} | 
      <span class="${task.category?.toLowerCase()}">${task.category || "General"}</span>
    </small>
  </div>

  <div>
    <button onclick="deleteTask(${task.id})">❌</button>
    <button onclick="completeTask(${task.id})">✔</button>
  </div>
`;  

        list.appendChild(li);
      });

      // Progress bar update
      let progress = data.length === 0 ? 0 : (completed / data.length) * 100;
      document.getElementById("progressFill").style.width = progress + "%";
    });
}

function addTask() {
  const title = document.getElementById("task").value;
  const deadline = document.getElementById("deadline").value;
  const category = document.getElementById("category").value;

  fetch(API, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title, deadline, category })
  }).then(() => fetchTasks());
}

function deleteTask(id) {
  fetch(`${API}/${id}`, { method: "DELETE" })
    .then(() => fetchTasks());
}

function completeTask(id) {
  fetch(`${API}/${id}`, { method: "PUT" })
    .then(() => fetchTasks());
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

fetchTasks();