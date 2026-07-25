const fs = require("fs");
const path = require("path");

const TASK_FILE = path.join(__dirname, "tasks.json");

function loadTasks() {
  if (!fs.existsSync(TASK_FILE)) {
    return [];
  }

  const raw = fs.readFileSync(TASK_FILE, "utf-8").trim();

  if (raw.length === 0) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error parsing tasks.json:", e);
    process.exit(1);
  }
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing tasks.json:", e);
    process.exit(1);
  }
}

function addTask(args) {
  const description = args[0];

  if (!description || description.trim() === "") {
    console.log("Error: Task description cannot be empty.");
    return;
  }

  const tasks = loadTasks();

  const newId =
    tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;

  const now = new Date().toISOString();

  const newTask = {
    id: newId,
    description: description,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`Task added with ID: ${newId}`);
}

function listTasks(args) {
  const filter = args[0];
  const tasks = loadTasks();

  let filtered;

  if (!filter) {
    filtered = tasks;
  } else if (["done", "todo", "in-progress"].includes(filter)) {
    filtered = tasks.filter((t) => t.status === filter);
  } else {
    console.error(
      `Error: unknown filter "${filter}". Use: done, todo, or in-progress.`,
    );
    return;
  }

  if (filtered.length === 0) {
    console.log("No tasks found.");
    return;
  }

  filtered.forEach((task) => {
    console.log(
      `ID: ${task.id}, Status: ${task.status}, Description: ${task.description}`,
    );
  });
}

function updateTask(args) {
  const id = parseInt(args[0], 10);
  const newDescription = args[1];

  if (isNaN(id)) {
    console.error("Error: Invalid task ID.");
    return;
  }

  if (!newDescription || newDescription.trim() === "") {
    console.error("Error: Task description cannot be empty.");
    return;
  }

  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    console.error(`Error: no task found with ID ${id}.`);
    process.exit(1);
  }

  task.description = newDescription;
  task.updatedAt = new Date().toISOString();

  saveTasks(tasks);
  console.log(`Task with ID ${id} updated successfully.`);
}

function deleteTask(args) {
  const id = parseInt(args[0], 10);

  if (isNaN(id)) {
    console.error("Error: Invalid task ID.");
    return;
  }

  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    console.error(`Error: no task found with ID ${id}.`);
    return;
  }

  const updatedTasks = tasks.filter((t) => t.id !== id);
  saveTasks(updatedTasks);
  console.log(`Task with ID ${id} deleted successfully.`);
}

function markStatus(args, status) {
  const id = parseInt(args[0], 10);

  if (isNaN(id)) {
    console.error("Error: Invalid task ID.");
    return;
  }

  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    console.error(`Error: no task found with ID ${id}.`);
    return;
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();

  saveTasks(tasks);
  console.log(`Task with ID ${id} marked as ${status}.`);
}

const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    addTask(args);
    break;
  case "list":
    listTasks(args);
    break;
  case "update":
    updateTask(args);
    break;
  case "delete":
    deleteTask(args);
    break;
  case "mark-in-progress":
    markStatus(args, "in-progress");
    break;
  case "mark-done":
    markStatus(args, "done");
    break;
  default:
    console.log(`Unknown command: ${command}`);
}
