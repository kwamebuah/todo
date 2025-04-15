export class Project {
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