class Task {
    constructor(title, dueDate, description) {
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
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }
    addTask(title, dueDate, description) {
        const task = new Task(title, dueDate, description)
        this.tasks.push(task);
    }
    listTasks() {
        return this.tasks.map((task, index) => `${index + 1}. ${task.showTask()}`);
    }
    showTaskDetails(index) {
        let detail = "";
        this.tasks.forEach((task, i) => {
            if (i === index) {
                detail = task.showDetail();
            }
        });
        return detail;
    }
    toggleTaskCompleted(index) {
        this.tasks.forEach((task, i) => {
            if (i === index) { task.toggleCompleted(); }
        });
    }
}

class ToDoApp {
    constructor() {
        this.projects = {};
    }
    addProject(projectName) {
        if (this.projects[projectName]) {
            console.log('Project already exits');
        }
        else { this.projects[projectName] = new Project(projectName); }
    }
    listProjects() {
        Object.keys(this.projects).forEach(project => console.log(project));
     }

    addTaskToProject(projectName, title, dueDate, description) {
        const project = this.projects[projectName]; 
        if(project) {
            project.addTask(title, dueDate, description);
        }
    }
    listProjectTasks(projectName) {
        const project = this.projects[projectName];
        if (project) {
            project.listTasks().forEach(taskString => console.log(taskString));
        }
    }
    toggleProjectTaskCompleted(projectName, taskIndex) {
        const project = this.projects[projectName];
        if (project) {
            project.toggleTaskCompleted(taskIndex);
        }
    }
    showTaskDetails(projectName, taskIndex) {
        const project = this.projects[projectName];
        if (project) {
            const detail = project.showTaskDetails(taskIndex);
            console.log(detail);
        }
    }
}

const app = new ToDoApp;

const projectName = 'default';
app.addProject(projectName);
app.addTaskToProject(projectName, 'Test','2025-04-12', 'Test #1');
app.addTaskToProject(projectName, '2nd test', '2025-05-12', 'Test #2');
app.listProjectTasks(projectName);
app.toggleProjectTaskCompleted(projectName, 1);
app.listProjectTasks(projectName);
app.showTaskDetails(projectName, 0);

app.listProjects();