import './style.css';
import { ToDoApp } from "./ToDoApp.js";
import { taskTemplate } from "./taskTemplate.js";

const app = new ToDoApp();
let currentProject = app.getDefaultProjectName();

const projectListEl = document.querySelector('.project-list');
const newProjectBtn = document.querySelector('.new-project-btn');
const projectTitleEl = document.querySelector('.project-title');
const taskListContainer = document.querySelector('.task-list-container');
const taskTitle = document.getElementById('taskTitle');
const taskDue = document.getElementById('taskDue');
const taskDesc = document.getElementById('taskDesc');
const addTaskBtn = document.getElementById('addTaskBtn');

// Initial render
renderProjectList();
renderTaskList(currentProject);
renderTaskForm();

newProjectBtn.addEventListener('click', () => {
    const name = prompt('Enter new project name:');
    if (!name?.trim()) return;

    app.addProject(name.trim());
    currentProject = name.trim();
    renderProjectList();
    renderTaskList(currentProject);
});

function renderTaskForm() {
    const formContainer = document.getElementById('dynamicTaskForm');
    formContainer.innerHTML = '';

    for (const [key, config] of Object.entries(taskTemplate)) {
        const input = document.createElement('input');
        input.id = `task_${key}`;
        input.placeholder = config.prompt;

        if (key.toLowerCase().includes('date')) {
            input.type = 'date';
        }

        formContainer.appendChild(input);
    }
}

addTaskBtn.addEventListener('click', () => {
    const taskData = {};

    for (const [key, config] of Object.entries(taskTemplate)) {
        const input = document.getElementById(`task_${key}`);
        const value = input.value;

        if (config.required && !value) {
            alert(`${config.prompt} is required.`);
            return;
        }

        taskData[key] = value;
    }

    app.addTaskToProject(currentProject, taskData);

    for (const key of Object.keys(taskTemplate)) {
        document.getElementById(`task_${key}`).value = '';
    }

    renderTaskList(currentProject);
});

function renderProjectList() {
    projectListEl.innerHTML = '';
    const projects = app.getProjectNames();

    projects.forEach(name => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = name;
        a.addEventListener('click', () => {
            currentProject = name;
            renderTaskList(currentProject);
        });

        li.appendChild(a);
        projectListEl.appendChild(li);
    });
}

function renderTaskList(projectName) {
    projectTitleEl.textContent = `${projectName} Tasks`;
    taskListContainer.innerHTML = '';

    const tasks = app.getProjectTasks(projectName)

    tasks.forEach((summary, index) => {
        const div = document.createElement('div');
        div.className = 'task';
        if (app.getTaskStatus(projectName, index)) {
            div.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = summary;

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✅';
        completeBtn.addEventListener('click', () => {
            app.toggleTaskCompleted(projectName, index);
            renderTaskList(projectName);
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.addEventListener('click', () => {
            const detail = app.getTaskDetails(projectName, index);
            const lines = detail.split('\n');
            const [statusAndTitle, ...descLines] = lines;
            const oldTask = {
                title: statusAndTitle.replace(/^\[.\]\s*/, '').split(' Due: ')[0],
                dueDate: '', // we can’t extract this from summary without parsing it
                description: descLines.join('\n')
            };

            const newTitle = prompt('Edit Title:', oldTask.title);
            const newDue = prompt('Edit Due Date (YYYY-MM-DD):', taskDue.value);
            const newDesc = prompt('Edit Description:', oldTask.description);

            const updates = {};
            if (newTitle !== null) updates.title = newTitle;
            if (newDue !== null) updates.dueDate = newDue;
            if (newDesc !== null) updates.description = newDesc;

            app.editTask(projectName, index, updates);
            renderTaskList(projectName);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => {
            app.deleteTask(projectName, index);
            renderTaskList(projectName);
        });

        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = 'ℹ️';
        detailsBtn.addEventListener('click', () => {
            const detail = app.getTaskDetails(projectName, index);
            alert(detail);
        });

        div.appendChild(span);
        div.appendChild(completeBtn);
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        div.appendChild(detailsBtn);

        taskListContainer.appendChild(div);
    });
}