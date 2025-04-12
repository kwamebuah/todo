class Task {
    constructor({ title, dueDate, description }) {
        this.title = title;
        this.dueDate = dueDate ? new Date(dueDate) : null;
        this.description = description;
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
    addTask(project, title, dueDate, description) {
        const task = new Task({ title, dueDate, description });
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
}

class ToDoApp {
    constructor() {
        this.projectManager = new ProjectManager;
        this.taskManager = new TaskManager;
    }
    addProject(name) {
        this.projectManager.addProject(name);
    }
    addTaskToProject(projectName, title, dueDate, description) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.addTask(project, title, dueDate, description);
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
        if (project) {
            console.log(this.taskManager.getTaskDetails(project, taskIndex));
        }
    }
    listProjectTasks(projectName) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.listTasks(project).forEach(taskString => console.log(taskString));
        }
    }
    listAllProjects() {
        this.projectManager.listProjects().forEach(name => console.log(name));
    }
}

const app = new ToDoApp;

const projectName = 'default';
app.addProject(projectName);
app.addTaskToProject(projectName, 'Test', '2025-04-12', 'Test #1');
app.addTaskToProject(projectName, '2nd test', '2025-05-12', 'Test #2');
app.listProjectTasks(projectName);
app.toggleTaskCompleted(projectName, 1);
app.listProjectTasks(projectName);
app.showTaskDetails(projectName, 0);

app.listAllProjects();