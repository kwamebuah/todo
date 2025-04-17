export class Task {
    constructor({ title, dueDate, description }) {
        this.title = title;
        this.dueDate = dueDate ? new Date(dueDate) : null;
        this.description = description?.trim() || '(No description provided)';
        this.complete = false;
    }

    toggleCompleted() { 
        this.complete = !this.complete;
    };

    getCompletedStatus() {
        return this.complete ? '√' : 'x';
    }

    getDueDate() {
        return this.dueDate ? new Date(this.dueDate).toDateString() : 'No due date';
    }
    
    showTask() {
        return `[${this.getCompletedStatus()}] ${this.title} Due: ${this.getDueDate()}`;
    }

    showDetail() {
        return this.showTask() + `\n${this.description}`;
    }
    
    edit(updates) {
        if (updates.title !== undefined) { this.title = updates.title; }
        if (updates.dueDate !== undefined) { this.dueDate = updates.dueDate ? new Date(updates.dueDate) : null; }
        if (updates.description !== undefined) { this.description = updates.description?.trim() || '(No description provided)'; }
    }
}