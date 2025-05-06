import { Project } from "./project.js";

export class ProjectManager {
    constructor() {
        this.projects = {};
    }

    getProject(name) {
        return this.projects[name];
    }

    addProject(name) {
        if (this.projects[name]) {
            console.log(`Project: ${name} already exits.`);
        }
        else {
            this.projects[name] = new Project({ name });
        }
    }

    listProjects() {
        return Object.keys(this.projects);
    }

    deleteProject(name) {
        delete this.projects[name];
    }
}