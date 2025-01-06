// script.js
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const alarmBox = document.getElementById("alarm");
const alarmText = document.getElementById("alarm-text");
const stopAlarmButton = document.getElementById("stop-alarm");

// Use uma música local ou uma fonte confiável de áudio
let alarmSound = new Audio("./metallica.mp3");
let alarmTimeout;

// Preload do som para evitar atrasos
document.body.addEventListener("click", () => {
  alarmSound.play();
  alarmSound.pause();
  alarmSound.currentTime = 0;
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = document.getElementById("task").value;
  const datetime = document.getElementById("datetime").value;

  if (new Date(datetime) <= new Date()) {
    alert("Please select a future date and time!");
    return;
  }

  addTask(task, datetime);
  taskForm.reset();
});

function addTask(task, datetime) {
  const listItem = document.createElement("li");

  const taskText = document.createElement("span");
  taskText.textContent = `${task} - ${new Date(datetime).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`;
  listItem.appendChild(taskText);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "edit-task";
  editButton.onclick = () => editTask(listItem, taskText, datetime);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-task";
  deleteButton.onclick = () => deleteTask(listItem);

  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  taskList.appendChild(listItem);

  scheduleAlarm(task, datetime);
}

function editTask(listItem, taskText, datetime) {
  const newTask = prompt("Edit Task:", taskText.textContent.split(" - ")[0]);
  const newDatetime = prompt("Edit Date & Time (YYYY-MM-DDTHH:MM):", datetime);

  if (newTask && newDatetime && new Date(newDatetime) > new Date()) {
    taskText.textContent = `${newTask} - ${new Date(newDatetime).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`;
    listItem.setAttribute("data-datetime", newDatetime);
  } else {
    alert("Invalid task or date/time. Please try again.");
  }
}

function deleteTask(listItem) {
  if (confirm("Are you sure you want to delete this task?")) {
    listItem.remove();
  }
}

function scheduleAlarm(task, datetime) {
  const alarmTime = new Date(datetime).getTime() - 60000;

  if (alarmTime > Date.now()) {
    setTimeout(() => triggerAlarm(task), alarmTime - Date.now());
  }
}

function triggerAlarm(task) {
  alarmText.textContent = `Reminder: ${task}`;
  alarmBox.classList.remove("hidden");
  alarmSound.loop = true;
  alarmSound.play();

  alarmTimeout = setTimeout(() => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }, 60000); // Auto-stop alarm after 1 minute
}

stopAlarmButton.addEventListener("click", () => {
  alarmBox.classList.add("hidden");
  alarmSound.pause();
  alarmSound.currentTime = 0;
  clearTimeout(alarmTimeout);
});

