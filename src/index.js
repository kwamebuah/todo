const taskTemplate = {
    title: { required: true, prompt: 'Enter task title:' },
    dueDate: { required: false, prompt: 'Enter due date (YYYY-MM-DD) or leave blank:' },
    description: { required: false, prompt: 'Provide a task description:' },
};

class Task {
    constructor({ title, dueDate, description }) {
        this.title = title;
        this.dueDate = dueDate ? new Date(dueDate) : null;
        this.description = description?.trim() ?? '(No description provided)';
        this.complete = false;
    }
    toggleCompleted() { this.complete = !this.complete };
    getCompletedStatus() {
        const completedStatus = this.complete ? '√' : 'x';
        return completedStatus;
    }
    getDueDate() {
        const due = this.dueDate ? new Date(this.dueDate).toDateString() : 'No due date';
        return due;
    }
    showTask() {
        return `[${this.getCompletedStatus()}] ${this.title} Due: ${this.getDueDate()}`;
    }
    showDetail() {
        return this.showTask() + `\n${this.description}`;
    }
    edit(updates) {
        if (updates.title !== undefined) { this.title = updates.title; }
        if (updates.dueDate !== undefined) { this.dueDate = updates.dueDate ? new Date(updates.dueDate) : null; }
        if (updates.description !== undefined) { this.description = updates.description?.trim() ?? '(No description provided)'; }
    }
}

class Project {
    constructor({ name }) {
        this.name = name;
        this.tasks = [];
    }
    addTask(task) {
        this.tasks.push(task);
    }
    getTask(index) {
        return this.tasks[index];
    }
    listTasks() {
        return this.tasks.map((task, index) => `${index + 1}. ${task.showTask()}`);
    }
    deleteTask(index) {
        if (index >= 0 && index <= this.tasks.length) {
            this.tasks.splice(index, 1);
        }
    }
}

class ProjectManager {
    constructor() {
        this.projects = {};
    }
    getProject(projectName) {
        return this.projects[projectName];
    }
    addProject(projectName) {
        if (this.projects[projectName]) {
            console.log(`Project: ${projectName} already exits.`);
        }
        else {
            this.projects[projectName] = new Project({ name: projectName });
        }
    }
    listProjects() {
        return Object.keys(this.projects);
    }
}

class TaskManager {
    constructor() { }
    addTask(project, taskData) {
        const task = new Task(taskData);
        project.addTask(task);
    }
    toggleTaskCompleted(project, taskIndex) {
        const task = project.getTask(taskIndex);
        task.toggleCompleted();
    }
    getTaskDetails(project, taskIndex) {
        const task = project.getTask(taskIndex);
        return task ? task.showDetail() : 'Task not found.';
    }
    listTasks(project) {
        return project.listTasks();
    }
    deleteTask(project, taskIndex) {
        project.deleteTask(taskIndex);
    }
    editTask(project, taskIndex, updates) {
        const task = project.getTask(taskIndex);
        if (task) {
            task.edit(updates);
        }
    }
    transferTaskToProject(project1, project2, taskIndex) {
        const task = project1.getTask(taskIndex);
        if (task) {
            project2.addTask(task);
            project1.deleteTask(taskIndex);
        }
    }
}

class ToDoApp {
    constructor() {
        this.projectManager = new ProjectManager;
        this.taskManager = new TaskManager;
    }
    addProject(name) {
        this.projectManager.addProject(name);
    }
    addTaskToProject(projectName, taskData) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.addTask(project, taskData);
        }
    }
    toggleTaskCompleted(projectName, taskIndex) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.toggleTaskCompleted(project, taskIndex);
        }
    }
    showTaskDetails(projectName, taskIndex) {
        const project = this.projectManager.getProject(projectName);
        return project ? this.taskManager.getTaskDetails(project, taskIndex) : 'Project not found.';
    }
    listProjectTasks(projectName) {
        const project = this.projectManager.getProject(projectName);
        return project ? this.taskManager.listTasks(project) : ['Project not found.'];
    }
    listAllProjects() {
        return this.projectManager.listProjects();
    }
    deleteTask(projectName, taskIndex) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.deleteTask(project, taskIndex);
        }
    }
    editTask(projectName, taskIndex, updates) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.editTask(project, taskIndex, updates);
        }
    }
    transferTaskToProject(project1, project2, taskIndex) {
        if (project1 && project2) {
            this.taskManager.transferTaskToProject(project1, project2, taskIndex);
        }
    }
}

function callUserInterface() {
    const app = new ToDoApp;

    let exit = false;

    while (!exit) {
        const choice = prompt(
            `📝 To-Do Menu:
1. Add Project
2. Add Task to Project
3. List Project Tasks
4. Edit Task
5. Delete Task
6. Toggle Task Completion
7. Show Task Details
8. List All Projects
9. Transfer Task to Another Project
10. Quit
Enter your choice (1-10):`
        );

        switch (choice) {
            case '1': {
                const projectName = prompt('Enter a new project name:');
                app.addProject(projectName);
                console.log(`✅ Project "${projectName}" added.`);
                break;
            }
            case '2': {
                const projectName = prompt('Enter the project name to add task to:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found');
                    break;
                }
                const taskData = {};
                for (const [field, config] of Object.entries(taskTemplate)) {
                    const response = prompt(config.prompt);
                    if (config.required && !response) {
                        alert(`${field} is required`);
                        return;
                    }
                    taskData[field] = response || null;
                }
                app.addTaskToProject(projectName, taskData);
                console.log(`✅ Task added to project "${projectName}.`);
                break;
            }
            case '3': {
                const projectName = prompt('Enter the project name:');
                const tasks = app.listProjectTasks(projectName);
                tasks.forEach(task => console.log(task));
                break;
            }
            case '4': {
                const projectName = prompt('Enter the project name:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found.');
                    break;
                }

                const taskCount = app.listProjectTasks(projectName).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to edit:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid task number.');
                    break;
                }
                const taskIndex = taskNum - 1;
                const task = project.getTask(taskIndex);

                const updates = {};
                for (const [field] of Object.entries(taskTemplate)) {
                    const currentVal = task[field] ?? '';
                    const newVal = prompt(`Edit ${field} (current: ${currentVal}) or press Enter to keep:`);

                    if (newVal !== '') {
                        updates[field] = newVal;
                    }
                }
                app.editTask(projectName, taskIndex, updates);
                console.log('✏️ Task updated!');
                break;
            }
            case '5': {
                const projectName = prompt('Enter project name:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found.');
                    break;
                }

                const taskCount = app.listProjectTasks(projectName).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to delete:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid number.');
                    break;
                }
                const index = taskNum - 1;
                app.deleteTask(projectName, index);
                console.log(`🗑️ Task #${taskNum} deleted.`);
                break;
            }
            case '6': {
                const projectName = prompt('Enter project name:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found.');
                    break;
                }

                const taskCount = app.listProjectTasks(projectName).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to toggle complete:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid number.');
                    break;
                }
                const index = taskNum - 1;
                app.toggleTaskCompleted(projectName, index);
                console.log(`✅ Task #${taskNum} toggled.`);
                break;
            }
            case '7': {
                const projectName = prompt('Enter project name:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found.');
                    break;
                }

                const taskCount = app.listProjectTasks(projectName).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to view details:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid number.');
                    break;
                }
                const index = taskNum - 1;
                console.log(app.showTaskDetails(projectName, index));
                break;
            }
            case '8': {
                const projects = app.listAllProjects();
                console.log('📁 Projects:');
                projects.forEach(project => console.log(project));
                break;
            }
            case '9': {
                const project1Name = prompt('Enter project name containing task:');
                const project1 = app.projectManager.getProject(project1Name);
                if (!project1) {
                    alert('Project not found.');
                    break;
                }
                const taskCount = app.listProjectTasks(project1Name).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to transfer:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid number.');
                    break;
                }
                const index = taskNum - 1;

                const project2Name = prompt('Enter project name to transfer task:');
                const project2 = app.projectManager.getProject(project2Name);
                if (!project2) {
                    alert('Project not found.');
                    break;
                }
                app.transferTaskToProject(project1, project2, index);
                console.log(`Task transfered from ${project1Name} to ${project2Name}.`);
                break;
            }
            case '10': {
                exit = true;
                console.log('👋 Exiting To-Do App. Goodbye!');
                break;
            }
            default:
                alert('Invalid option. Please choose between 1 and 9.');
        }
    }
}

callUserInterface();