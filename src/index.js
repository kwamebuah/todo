import './style.css';
import { ToDoApp } from "./ToDoApp.js";
import { taskTemplate } from "./taskTemplate.js";
import { add } from 'date-fns';

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

newProjectBtn.addEventListener('click', () => {
    const modal = document.createElement('dialog');
    const form = document.createElement('form');
    const h3 = document.createElement('h3');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const submitBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    form.classList.add('new-project-form');
    form.setAttribute('method', 'dialog');
    h3.textContent = 'New Project';
    label.setAttribute('for', 'new-project');
    label.textContent = 'Project Name: ';
    input.setAttribute('name', 'new-project');
    input.setAttribute('id', 'new-project');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.textContent = 'Add';
    cancelBtn.setAttribute('value', 'cancel');
    cancelBtn.setAttribute('formmethod', 'dialog');
    cancelBtn.textContent = 'Cancel';

    p1.appendChild(label);
    p1.appendChild(input);
    p2.appendChild(submitBtn);
    p2.appendChild(cancelBtn);
    form.appendChild(h3);
    form.appendChild(p1);
    form.appendChild(p2);
    modal.appendChild(form);
    document.body.appendChild(modal);

    modal.showModal();

    submitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const name = input.value;
        if (!name?.trim()) return;

        app.addProject(name.trim());
        currentProject = name.trim();
        renderProjectList();
        renderTaskList(currentProject);

        modal.close();
    });
});

function openTaskModal() {
    const modal = document.createElement('dialog');;
    modal.classList.add('task-modal');

    const form = document.createElement('form');

    const h3 = document.createElement('h3');
    h3.textContent = 'New Task';
    form.appendChild(h3);

    const inputs = {};

    for (const [key, config] of Object.entries(taskTemplate)) {
        const p = document.createElement('p');
        const input = document.createElement('input');
        const label = document.createElement('label');

        label.setAttribute('for', `task_${key}`);
        label.textContent = config.prompt;
        input.id = `task_${key}`;
        input.placeholder = config.prompt;

        if (key.toLowerCase().includes('date')) {
            input.type = 'date';
        }

        inputs[key] = input;

        p.appendChild(label);
        p.appendChild(input);
        form.appendChild(p);
    }

    const p = document.createElement('p');
    const submitBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    submitBtn.type = 'submit';
    submitBtn.textContent = 'Add';
    submitBtn.disabled = true;

    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        modal.close();
        modal.remove();
    });

    p.appendChild(submitBtn);
    p.appendChild(cancelBtn);
    form.appendChild(p);

    modal.appendChild(form);
    document.body.appendChild(modal);
    modal.show();

    const validateForm = () => {
        const isValid = Object.entries(taskTemplate).every(([key, config]) => {
            if(!config.required) return true;
            const val = inputs[key].value.trim();
            return val !== '';
        });

        submitBtn.disabled = !isValid;
    };

    Object.values(inputs).forEach(input => {
        input.addEventListener('input', validateForm);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskData = {};
        for (const [key] of Object.entries(taskTemplate)) {
            taskData[key] = inputs[key].value;
        }

        app.addTaskToProject(currentProject, taskData);

        modal.close();
        modal.remove();

        renderTaskList(currentProject);
    });
}

addTaskBtn.addEventListener('click', openTaskModal);

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
            const currentValues = app.getTaskDataForEdit(projectName, index);
            if (!currentValues) return;

            const updates = {};
            for (const [key, config] of Object.entries(taskTemplate)) {
                const userInput = prompt(`Edit: ${config.prompt}`, currentValues[key]);
                if (userInput !== null) {
                    const trimmed = userInput.trim();
                    updates[key] = trimmed;
                }
            }

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