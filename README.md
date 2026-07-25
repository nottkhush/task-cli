# Task Tracker CLI

A simple command-line tool to track what you need to do, what you're working on, and what you've finished. No external libraries — just plain Node.js.

Project URL: https://roadmap.sh/projects/task-tracker
---

## What is this, really?

It's a small program you run from your terminal. Every time you run it, it:

1. Reads a file called `tasks.json` (creates it if it doesn't exist yet)
2. Does whatever you asked it to do (add a task, list tasks, etc.)
3. Saves the updated list back into `tasks.json`

That's it. `tasks.json` is your entire "database" — just a text file sitting in the project folder.

---

## Before you start: things you need

- **Node.js** installed on your computer. Check by running:
  ```bash
  node -v
  ```
  If that prints a version number (like `v22.19.0`), you're good. If it errors, install Node.js from [nodejs.org](https://nodejs.org) first.

- A terminal (Command Prompt, PowerShell, Terminal.app, or your code editor's built-in terminal all work).

---

## How to run it

1. Open a terminal.
2. Navigate into the project folder:
   ```bash
   cd path/to/task-cli
   ```
3. Run commands using this pattern:
   ```bash
   node index.js <command> <arguments>
   ```

For example:
```bash
node index.js add "Buy groceries"
```

That's the whole pattern. Everything below is just different values for `<command>` and `<arguments>`.

> **Tip:** If you see `node index.js` a lot below, that's not a typo — you type that every time, followed by what you actually want to do.

---

## Commands

### Add a task

```bash
node index.js add "Buy groceries"
```

Output:
```
Task added with ID: 1
```

Every new task starts with status `todo`. The number in the output (the ID) is how you'll refer to this task later — for updating, deleting, or marking it done.

---

### List tasks

See everything:
```bash
node index.js list
```

See only tasks you haven't started:
```bash
node index.js list todo
```

See only tasks you're currently working on:
```bash
node index.js list in-progress
```

See only tasks you've finished:
```bash
node index.js list done
```

Example output:
```
ID: 1, Status: todo, Description: Buy groceries
ID: 2, Status: in-progress, Description: Walk the dog
```

---

### Update a task's description

Made a typo, or the task changed? Update it by ID:

```bash
node index.js update 1 "Buy groceries and cook dinner"
```

Output:
```
Task 1 updated successfully.
```

---

### Delete a task

```bash
node index.js delete 1
```

Output:
```
Task 1 deleted successfully.
```

This removes it permanently — there's no undo, so double check the ID first with `node index.js list`.

---

### Mark a task as in progress

```bash
node index.js mark-in-progress 1
```

### Mark a task as done

```bash
node index.js mark-done 1
```

Both print a confirmation like:
```
Task 1 marked as done.
```

---

## Quick reference

| What you want to do          | Command                                              |
|-------------------------------|-------------------------------------------------------|
| Add a task                    | `node index.js add "description"`                     |
| List all tasks                | `node index.js list`                                   |
| List only todo tasks          | `node index.js list todo`                              |
| List only in-progress tasks   | `node index.js list in-progress`                        |
| List only done tasks          | `node index.js list done`                               |
| Update a task                 | `node index.js update <id> "new description"`            |
| Delete a task                 | `node index.js delete <id>`                              |
| Mark a task in progress       | `node index.js mark-in-progress <id>`                     |
| Mark a task done              | `node index.js mark-done <id>`                            |

Replace `<id>` with the actual task number shown when you ran `add` or `list`.

---

## Where's my data stored?

In a file called `tasks.json`, sitting right next to `index.js` in the project folder. You can open it in any text editor to look at the raw data — it's a plain JSON array of task objects, each with:

- `id` — unique number for the task
- `description` — what the task is
- `status` — `todo`, `in-progress`, or `done`
- `createdAt` — when the task was first added
- `updatedAt` — when it was last changed

You never need to edit this file by hand — always go through the commands above so the data stays consistent.

---

## Troubleshooting

**"command not found: node"**
Node.js isn't installed, or your terminal doesn't know where to find it. Install it from [nodejs.org](https://nodejs.org) and restart your terminal.

**Nothing happens / no output**
Make sure you're in the right folder (`cd path/to/task-cli`) and that `index.js` is actually there — run `ls` (Mac/Linux) or `dir` (Windows) to check.

**"no task found with ID X"**
Run `node index.js list` first to see which IDs actually exist — you might be referencing a task that was already deleted, or a typo in the number.

**Description with spaces isn't working**
Always wrap descriptions in quotes:
```bash
node index.js add "Buy groceries"     ✅ correct
node index.js add Buy groceries       ❌ only "Buy" gets used
```

---

## Why no external libraries?

This project intentionally avoids npm packages (no `commander`, no `yargs`) to practice working directly with:
- `process.argv` for reading command-line input
- Node's built-in `fs` module for reading/writing files
- Plain JavaScript for parsing and validating input

It's a good exercise in understanding what those libraries are actually doing under the hood before reaching for them in bigger projects.
