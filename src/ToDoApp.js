import { TaskManager } from "./taskManager.js";
import { ProjectManager } from "./projectManager.js";

export class ToDoApp {
    constructor() {
        this.projectManager = new ProjectManager();
        this.taskManager = new TaskManager();
        this.defaultProjectName = 'Default';
        this.projectManager.addProject(this.defaultProjectName);
    }

    addTasktoDefaultProject(taskData) {
        const project = this.projectManager.getProject(this.defaultProjectName);
        this.taskManager.addTask(project, taskData);
    }

    getDefaultProjectName() {
        return this.defaultProjectName;
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