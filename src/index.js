// import { parse, isValid, format } from 'date-fns';

function makeTodo() {
    const attr = ['title', 'description', 'dueDate', 'priority'];

    const todo = attr.reduce((acc, curr) => {
        acc[curr] = "";
        return acc;
    }, {});

    return todo;
}

function storeProject(details) {
    const todo = details.todo;
    let projectName = details.projectName;
    const projects = [];
    const project1 = {
        name: 'default',
        tasks: [],
    }

    projects.push(project1);

    if (projectName === "" || projectName === null) {
        projectName = 'default';
    }    

    for (const project of projects) {
        if (project.name === projectName) {
            project.tasks.push(todo);
        } 
    }
    console.log(projects);
}

function controlUserInterface() {
    const choice = Number(prompt('Choices:\n1. Add a to do'));

    if (choice === 1) {
        const todo = makeTodo();
        for (const attr in todo) {
            todo[attr] = prompt(`Enter ${attr}`);
        }
        const projectName = prompt('Enter project Name:');
        storeProject({projectName, todo});
    }
}

controlUserInterface();
