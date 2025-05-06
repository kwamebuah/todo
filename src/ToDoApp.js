import { TaskManager } from "./taskManager.js";
import { ProjectManager } from "./projectManager.js";
import { taskTemplate } from './taskTemplate.js';

export class ToDoApp {
    constructor() {
        this.projectManager = new ProjectManager();
        this.taskManager = new TaskManager();
        this.defaultProjectName = 'Default';
        this.projectManager.addProject(this.defaultProjectName);
    }

    saveToLocalStorage() {
        const data = {
            projects: {},
        };

        for (const name of this.projectManager.listProjects()) {
            const project = this.projectManager.getProject(name);
            data.projects[name] = {
                name: project.name,
                tasks: project.tasks.map(task => {
                    const taskData = {};
                    for (const key of Object.keys(taskTemplate)) {
                        let value = task[key];
                        taskData[key] = value instanceof Date ? value.toISOString() : value;
                    }
                    taskData.complete = task.complete;
                    return taskData;
                }),
            };
        }

        localStorage.setItem('todoAppData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('todoAppData'));
        if (!data || !data.projects) return;

        for (const [name, projectData] of Object.entries(data.projects)) {
            this.projectManager.addProject(name);
            const project = this.projectManager.getProject(name);

            for (const taskData of projectData.tasks) {
                const formattedData = {};
                for (const key of Object.keys(taskTemplate)) {
                    if (key in taskData) {
                        formattedData[key] = key.includes('Date') && taskData[key]
                            ? new Date(taskData[key])
                            : taskData[key];
                    }
                }

                this.taskManager.restoreTask(project, {
                    ...formattedData,
                    complete: !!taskData.complete
                });
            }
        }
    }

    addProject(name) {
        this.projectManager.addProject(name);
        this.saveToLocalStorage();
    }

    getProjectNames() {
        return this.projectManager.listProjects();
    }

    deleteProject(projectName) {
        this.projectManager.deleteProject(projectName);
        this.saveToLocalStorage();
    }

    addTaskToProject(projectName, taskData) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.addTask(project, taskData);
            this.saveToLocalStorage();
        }
    }

    toggleTaskCompleted(projectName, taskIndex) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.toggleTaskCompleted(project, taskIndex);
            this.saveToLocalStorage();
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
            this.saveToLocalStorage();
        }
    }

    deleteTask(projectName, taskIndex) {
        const project = this.projectManager.getProject(projectName);
        if (project) {
            this.taskManager.deleteTask(project, taskIndex);
            this.saveToLocalStorage();
        }
    }

    transferTaskToProject(projectFromName, projectToName, taskIndex) {
        const fromProject = this.projectManager.getProject(projectFromName);
        const toProject = this.projectManager.getProject(projectToName);
        if (fromProject && toProject) {
            this.taskManager.transferTaskToProject(fromProject, toProject, taskIndex);
            this.saveToLocalStorage();
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

    getTaskDataForEdit(projectName, index) {
        const project = this.projectManager.getProject(projectName);
        const task = project?.getTask(index);

        if (!task) return null;

        const data = {};
        for (const key of Object.keys(taskTemplate)) {
            const value = task[key];
            data[key] = value instanceof Date
                ? value.toISOString().split('T')[0] // for date inputs
                : value ?? '';
        }
        return data;
    }
}