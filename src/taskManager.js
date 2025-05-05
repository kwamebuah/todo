import { Task } from "./task.js";

export class TaskManager {
    constructor() { }

    addTask(project, taskData) {
        const task = new Task(taskData);
        project.addTask(task);
    }

    toggleTaskCompleted(project, taskIndex) {
        const task = project.getTask(taskIndex);
        if (task) {
            task.toggleCompleted();
        }
    }

    getTaskDetails(project, taskIndex) {
        const task = project.getTask(taskIndex);
        return task ? task.showDetail() : 'Task not found.';
    }

    getTaskSummary(project, taskIndex) {
        const task = project.getTask(taskIndex);
        return task ? task.showTask() : 'Task not found.';
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

    getTaskCompletionStatus(project, taskIndex) {
        const task = project.getTask(taskIndex);
        return task?.complete ?? false;
    }
    
    transferTaskToProject(project1, project2, taskIndex) {
        const task = project1.getTask(taskIndex);
        if (task) {
            project2.addTask(task);
            project1.deleteTask(taskIndex);
        }
    }

    restoreTask(project, taskData) {
        const task = new Task(taskData);
        task.complete = !!taskData.complete;
        project.addTask(task);
    }
}