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
        try {
            this.tasks.splice(index, 1);
            return true;
        }
        catch {
            return false;
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
        return project.deleteTask(project, taskIndex);
    }
    editTask(project, taskIndex, updates) {
        const task = project.getTask(taskIndex);
        if (task) {
            task.edit(updates);
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
        const success =  project ? this.taskManager.deleteTask(project, taskIndex) : false;
        return success ? 'Sucessfully deleted' : 'Failed to delete task';
    }
    editTask(projectName, taskIndex, updates) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.editTask(project, taskIndex, updates);
        }
    }
}

const app = new ToDoApp;

function callUserInterface() {
    const projectName = prompt('Enter a project name:', 'default');
    const taskData = {};

    for (const [data, config] of Object.entries(taskTemplate)) {
        const response = prompt(config.prompt);
        if (config.required && !response) {
            alert(`${data} is required`);
            return;
        }
        taskData[data] = response || null;
    }
    app.addProject(projectName);
    app.addTaskToProject(projectName, taskData);
    console.log(`✅ Task added to project "${projectName}"`);

    console.log("📋 Current Tasks:");
    const taskList = app.listProjectTasks(projectName);
    taskList.forEach(task => console.log(task));

    console.log(app.showTaskDetails(projectName, 0));
    app.toggleTaskCompleted(projectName, 0);
    app.listProjectTasks(projectName).forEach(task => console.log(task));

    const editConfirm = prompt('Do you want to edit the task? (yes/no)', 'no');
    if (editConfirm.toLocaleLowerCase() === 'yes') {
        const taskCount = taskList.length;

        let taskNumber = Number(prompt(`Enter task number (1 - ${taskCount}) to edit:`, 10));
        if (isNaN(taskNumber) || taskNumber < 1 || taskNumber > taskCount) {
            alert('Invalid task number.');
            return;
        }

        const taskIndex = taskNumber - 1;
        const taskDetails = app.showTaskDetails(projectName, taskIndex);
        console.log(`📝Editing Task #${taskNumber}:`);
        console.log(taskDetails);

        const updates = {};
        const project = app.projectManager.getProject(projectName);
        const task = project.getTask(taskIndex);
        for (const [field, config] of Object.entries(taskTemplate)) {
            const currentVal = task[field] ?? '';
            const newVal = prompt(`Edit ${field} (current: ${currentVal}) or press Enter to keep:`);

            if (newVal !== '') {
                updates[field] = newVal;
            }
        }
        app.editTask(projectName, taskIndex, updates);
        console.log('✏️ Task updated!');
        console.log(app.showTaskDetails(projectName, taskIndex));
    }
    console.log(app.deleteTask(projectName, 0));

    app.listProjectTasks(projectName).forEach(task => console.log(task));
}

callUserInterface();