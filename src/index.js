import { ToDoApp } from "./ToDoApp.js";
import { taskTemplate } from "./taskTemplate.js";

function callUserInterface() {
    const app = new ToDoApp;

    let exit = false;

    while (!exit) {
        const choice = prompt(
            `📝 To-Do Menu:
1. Add Project
2. Add Task (goes to default project)
3. List Project Tasks
4. Edit Task
5. Delete Task
6. Toggle Task Completion
7. Show Task Details
8. List All Projects
9. Transfer Task to Another Project
10. Quit
Enter your choice (1-10):`
        );

        switch (choice) {
            case '1': {
                const projectName = prompt('Enter a new project name:');
                app.addProject(projectName);
                console.log(`✅ Project "${projectName}" added.`);
                break;
            }
            case '2': {
                const taskData = {};
                for (const [field, config] of Object.entries(taskTemplate)) {
                    const response = prompt(config.prompt);
                    if (config.required && !response) {
                        alert(`${field} is required`);
                        return;
                    }
                    taskData[field] = response || null;
                }
                
                app.addTasktoDefaultProject(taskData);
                console.log(`✅ Task added to project "${app.getDefaultProjectName()}".`);
                break;
            }
            case '3': {
                const projectName = prompt('Enter the project name:');
                const tasks = app.listProjectTasks(projectName);
                tasks.forEach(task => console.log(task));
                break;
            }
            case '4': {
                const projectName = prompt('Enter the project name:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found.');
                    break;
                }

                const taskCount = app.listProjectTasks(projectName).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to edit:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid task number.');
                    break;
                }
                const taskIndex = taskNum - 1;
                const task = project.getTask(taskIndex);

                const updates = {};
                for (const [field] of Object.entries(taskTemplate)) {
                    const currentVal = task[field] ?? '';
                    const newVal = prompt(`Edit ${field} (current: ${currentVal}) or press Enter to keep:`);

                    if (newVal !== '') {
                        updates[field] = newVal;
                    }
                }
                app.editTask(projectName, taskIndex, updates);
                console.log('✏️ Task updated!');
                break;
            }
            case '5': {
                const projectName = prompt('Enter project name:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found.');
                    break;
                }

                const taskCount = app.listProjectTasks(projectName).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to delete:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid number.');
                    break;
                }
                const index = taskNum - 1;
                app.deleteTask(projectName, index);
                console.log(`🗑️ Task #${taskNum} deleted.`);
                break;
            }
            case '6': {
                const projectName = prompt('Enter project name:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found.');
                    break;
                }

                const taskCount = app.listProjectTasks(projectName).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to toggle complete:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid number.');
                    break;
                }
                const index = taskNum - 1;
                app.toggleTaskCompleted(projectName, index);
                console.log(`✅ Task #${taskNum} toggled.`);
                break;
            }
            case '7': {
                const projectName = prompt('Enter project name:');
                const project = app.projectManager.getProject(projectName);
                if (!project) {
                    alert('Project not found.');
                    break;
                }

                const taskCount = app.listProjectTasks(projectName).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to view details:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid number.');
                    break;
                }
                const index = taskNum - 1;
                console.log(app.showTaskDetails(projectName, index));
                break;
            }
            case '8': {
                const projects = app.listAllProjects();
                console.log('📁 Projects:');
                projects.forEach(project => console.log(project));
                break;
            }
            case '9': {
                const project1Name = prompt('Enter project name containing task:');
                const project1 = app.projectManager.getProject(project1Name);
                if (!project1) {
                    alert('Project not found.');
                    break;
                }
                const taskCount = app.listProjectTasks(project1Name).length;
                const taskNum = Number(prompt(`Enter task number (1 - ${taskCount}) to transfer:`));
                if (isNaN(taskNum) || taskNum < 1 || taskNum > taskCount) {
                    alert('Invalid number.');
                    break;
                }
                const index = taskNum - 1;

                const project2Name = prompt('Enter project name to transfer task:');
                const project2 = app.projectManager.getProject(project2Name);
                if (!project2) {
                    alert('Project not found.');
                    break;
                }
                app.transferTaskToProject(project1, project2, index);
                console.log(`Task transfered from ${project1Name} to ${project2Name}.`);
                break;
            }
            case '10': {
                exit = true;
                console.log('👋 Exiting To-Do App. Goodbye!');
                break;
            }
            default:
                alert('Invalid option. Please choose between 1 and 9.');
        }
    }
}

callUserInterface();