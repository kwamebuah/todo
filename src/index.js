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

const projectName = 'default';
const project = new Project(projectName);

project.addTask('Test','2025-04-12', 'Test #1');
project.addTask('2nd test', '2025-05-12', 'Test #2');
project.listTasks().forEach(taskString => console.log(taskString));
project.toggleTaskCompleted(1);
project.listTasks().forEach(taskString => console.log(taskString));
console.log(project.showTaskDetails(0));