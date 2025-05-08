export const taskTemplate = {
    title: { required: true, prompt: 'Enter task title:' },
    dueDate: { required: false, prompt: 'Enter due date (YYYY-MM-DD) or leave blank:' },
    description: { required: false, prompt: 'Provide a task description:' },
    priority: { required: true, prompt: 'Select task priority (normal or high):' }
};