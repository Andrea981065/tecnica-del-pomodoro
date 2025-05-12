const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const timerDisplay = document.getElementById("timer");
const sessionTypeDisplay = document.getElementById("sessionType");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

let timeLeft = 25 * 60;
let isRunning = false;
let sessionType = "work"; // work or break
let interval = null;

// Tasks
let tasks = [];

// Timer Logic
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateTimer() {
  timerDisplay.textContent = formatTime(timeLeft);
}

function switchSession() {
  if (sessionType === "work") {
    sessionType = "break";
    timeLeft = 5 * 60;
    sessionTypeDisplay.textContent = "Break Session";
  } else {
    sessionType = "work";
    timeLeft = 25 * 60;
    sessionTypeDisplay.textContent = "Work Session";
  }
  updateTimer();
}

startPauseBtn.addEventListener("click", () => {
  isRunning = !isRunning;
  startPauseBtn.textContent = isRunning ? "Pause" : "Start";
  if (isRunning) {
    interval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        clearInterval(interval);
        isRunning = false;
        startPauseBtn.textContent = "Start";
        switchSession();
      }
    }, 1000);
  } else {
    clearInterval(interval);
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  isRunning = false;
  startPauseBtn.textContent = "Start";
  timeLeft = sessionType === "work" ? 25 * 60 : 5 * 60;
  updateTimer();
});

// Task Logic
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    tasks.push({ id: Date.now(), text, completed: false });
    taskInput.value = "";
    renderTasks();
  }
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("div");
    checkbox.className = "checkbox";
    checkbox.addEventListener("click", () => {
      task.completed = !task.completed;
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    const removeBtn = document.createElement("span");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      renderTasks();
    });

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.flexGrow = "1";

    container.appendChild(checkbox);
    container.appendChild(span);

    li.appendChild(container);
    li.appendChild(removeBtn);

    taskList.appendChild(li);
  });
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "🌞 Light Mode"
    : "🌙 Dark Mode";
});