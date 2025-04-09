// import { parse, isValid, format } from 'date-fns';

function makeTodo() {
    const attr = ['title', 'description', 'dueDate', 'priority'];

    const todo = attr.reduce((acc, curr) => {
        acc[curr] = "";
        return acc;
    }, {});

    return todo;
}

function controlUserInterface() {
    const choice = Number(prompt('Choices:\n1. Add a to do'));
    
    if (choice === 1) {
        const todo = makeTodo();
        for (const attr in todo) {
            todo[attr] = prompt(`Enter ${attr}`);
        }
        console.log(todo);
    }
}

controlUserInterface();
