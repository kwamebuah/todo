import { TaskManager } from "./taskManager.js";
import { ProjectManager } from "./projectManager.js";

export class ToDoApp {
    constructor() {
        this.projectManager = new ProjectManager();
        this.taskManager = new TaskManager();
        this.defaultProjectName = 'Default';
        this.projectManager.addProject(this.defaultProjectName);
    } 

    addProject(name) {
        this.projectManager.addProject(name);
    }

    getProjectNames() {
        return this.projectManager.listProjects();
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

    getProjectTasks(projectName) {
        const project = this.projectManager.getProject(projectName);
        if (!project) return [];
        return project.tasks.map((_, index) => this.taskManager.getTaskSummary(project, index));
    }

    getTaskDetails(projectName, taskIndex) {
        const project = this.projectManager.getProject(projectName);
        return project ? this.taskManager.getTaskDetails(project, taskIndex) : 'Project not found.';
    }

    getTaskStatus(projectName, taskIndex) {
        const project = this.projectManager.getProject(projectName);
        if (!project) return false;
        return this.taskManager.getTaskCompletionStatus(project, taskIndex);
    }

    editTask(projectName, taskIndex, updates) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.editTask(project, taskIndex, updates);
        }
    }

    deleteTask(projectName, taskIndex) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.deleteTask(project, taskIndex);
        }
    }

    transferTaskToProject(projectFromName, projectToName, taskIndex) {
        const fromProject = this.projectManager.getProject(projectFromName);
        const toProject = this.projectManager.getProject(projectToName);
        if (fromProject && toProject) {
            this.taskManager.transferTaskToProject(fromProject, toProject, taskIndex);
        }
    }

    listProjectTasks(projectName) {
        const project = this.projectManager.getProject(projectName);
        return project ? this.taskManager.listTasks(project) : ['Project not found.'];
    }

    getDefaultProjectName() {
        return this.defaultProjectName;
    }

    addTasktoDefaultProject(taskData) {
        this.addTaskToProject(this.defaultProjectName, taskData);
    }    
}