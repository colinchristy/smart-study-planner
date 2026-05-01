import './calendarView.css';
import { taskManager, type Task } from './tasks';

class CalendarView {
    private month: number;
    private monthNames: string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    private year: number;
    private weeksInMonth: number;
    private dateFirstIndex: Date;
    private dateLastIndex: Date;
    private cells: HTMLDivElement[];
    private backMonthButton: HTMLButtonElement;
    private forwardMonthButton: HTMLButtonElement;
    private monthDiv: HTMLDivElement;
    public constructor(containerDiv: HTMLDivElement) {
        const date = new Date();
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear();
        this.weeksInMonth = 5;
        this.dateFirstIndex = new Date();
        this.dateLastIndex = new Date();
        this.cells = [];
        this.backMonthButton = document.createElement('button');
        this.forwardMonthButton = document.createElement('button');
        this.monthDiv = document.createElement('div');
        this.createBaseHTML(containerDiv);
        this.updateView();
    }

    private createBaseHTML(containerDiv: HTMLDivElement) {
        this.createHeaderDiv(containerDiv);
        this.createDaysHeaderDiv(containerDiv);
        this.createCellsDiv(containerDiv);
    }

    private createHeaderDiv(containerDiv: HTMLDivElement) {
        const headerDiv = document.createElement('div');
        headerDiv.id = 'calendar-header';

        this.backMonthButton.id = 'button-back-month';
        this.backMonthButton.innerHTML = '<svg width="2rem" height="2rem" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffffde"><path d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5" stroke="#ffffffde" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
        this.backMonthButton.addEventListener('click', () => this.onBackMonthClicked());
        headerDiv.append(this.backMonthButton);

        this.forwardMonthButton.id = 'button-forward-month';
        this.forwardMonthButton.innerHTML = '<svg width="2rem" height="2rem" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffffde"><path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke="#ffffffde" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
        this.forwardMonthButton.addEventListener('click', () => this.onForwardMonthClicked());
        headerDiv.append(this.forwardMonthButton);

        this.monthDiv.id = 'month-div';
        this.monthDiv.innerText = '';
        headerDiv.append(this.monthDiv);

        containerDiv.append(headerDiv);
    }

    private createDaysHeaderDiv(containerDiv: HTMLDivElement) {
        const daysHeaderDiv = document.createElement('div');
        daysHeaderDiv.id = 'calendar-days-header';
        daysHeaderDiv.innerHTML = `<div class="calendar-day-header-cell">Sun</div>
                               <div class="calendar-day-header-cell">Mon</div>
                               <div class="calendar-day-header-cell">Tue</div>
                               <div class="calendar-day-header-cell">Wed</div>
                               <div class="calendar-day-header-cell">Thu</div>
                               <div class="calendar-day-header-cell">Fri</div>
                               <div class="calendar-day-header-cell">Sat</div>`;
        containerDiv.append(daysHeaderDiv);
    }
    
    private createCellsDiv(containerDiv: HTMLDivElement) {
        const cellsDiv = document.createElement('div');
        cellsDiv.id = 'calendar-cells-container';
        for (let i = 1; i <= 42; i++) {
            const newCell = document.createElement('div');
            newCell.classList.add('calendar-cell');
            newCell.classList.add('calendar-cell-border-left');
            newCell.classList.add('calendar-cell-border-bottom');
            if (i <= 7)
                newCell.classList.add('calendar-cell-border-top');
            if (i % 7 == 0)
                newCell.classList.add('calendar-cell-border-right');
            newCell.innerHTML = '<div class="cell-date"></div><div class="cell-tasks flex flex-col gap-025"></div>';
            cellsDiv.append(newCell)
            this.cells.push(newCell);
        }
        containerDiv.append(cellsDiv);
    }

    public updateView() {
        const daysInPreviousMonth = new Date(this.year, this.month - 1, 0).getDate();
        const daysInCurrentMonth = new Date(this.year, this.month, 0).getDate();
        const day1Index = new Date(this.year, this.month - 1, 1).getDay();

        this.weeksInMonth = Math.ceil((daysInCurrentMonth + day1Index) / 7);

        this.updateDates(daysInPreviousMonth, daysInCurrentMonth, day1Index);
        this.updateTasks();
        this.updateMonthDiv();
    }

    private updateDates(daysInPreviousMonth: number, daysInCurrentMonth: number, day1Index: number) {
        if (day1Index == 0) {
            this.dateFirstIndex = new Date(this.year, this.month - 1, 1);
        }
        for (let i = 0; i < this.cells.length; i++) {
            if (i >= this.weeksInMonth * 7) {
                this.cells[i].classList.add('hide');
                continue;
            }
            
            this.cells[i].classList.remove('hide');

            let date;
            if (i < day1Index) {
                const daysFromEnd = day1Index - i - 1;
                date = daysInPreviousMonth - daysFromEnd;
                this.cells[i].classList.add('different-month');
                if (i == 0) {
                    // this.month - 2 being negative causes it to update the year to be the previous as well
                    this.dateFirstIndex = new Date(this.year, this.month - 2, date);
                }
            }
            else if (i < day1Index + daysInCurrentMonth) {
                date = i - day1Index + 1;
                this.cells[i].classList.remove('different-month');
            }
            else {
                date = i - (day1Index + daysInCurrentMonth) + 1;
                this.cells[i].classList.add('different-month');
            }
            const dateDiv = this.cells[i].querySelector('.cell-date') as HTMLDivElement;
            dateDiv.innerText = String(date);

            if (i == this.weeksInMonth * 7 - 1) {
                const lastDayMonthIndex = (date > 6) ? this.month - 1 : this.month;
                this.dateLastIndex = new Date(this.year, lastDayMonthIndex, date);
            }
        }
    }
    
    private async updateTasks() {
        const tasks = await taskManager.getTasks();

        for (let i = 0; i < this.cells.length; i++) {
            const tasksDiv = this.cells[i].querySelector('.cell-tasks') as HTMLDivElement;
            tasksDiv.innerHTML = '';
        }

        tasks.forEach((task) => {
            const dueDate = new Date(task.due_date);
            if (dueDate >= this.dateFirstIndex && dueDate <= this.dateLastIndex) {
                this.addTaskSpan(task);
            }
        });
    }

    private addTaskSpan(task: Task) {
        const index = this.getCellIndex(new Date(task.due_date));
        const tasksDiv = this.cells[index].querySelector('.cell-tasks') as HTMLDivElement;
        tasksDiv.innerHTML += `<span class="calendar-task-span">${task.title}</span>`;
        console.log("Added task");
    }

    private getCellIndex(date: Date): number {
        return Math.round((date.getTime() - this.dateFirstIndex.getTime()) / (1000 * 60 * 60 * 24));
    }

    private updateMonthDiv() {
        this.monthDiv.innerText = this.getMonthName(this.month) + " " + this.year;
    }

    /**
     * @param index 1-based index for month (1 = January)
     * @returns String of month name
     */
    public getMonthName(index: number) {
        return this.monthNames[index - 1];
    }

    private onBackMonthClicked() {
        this.month -= 1;
        if (this.month == 0) {
            this.month = 12;
            this.year -= 1;
        }
        this.updateView();
    }

    private onForwardMonthClicked() {
        this.month += 1;
        if (this.month == 13) {
            this.month = 1;
            this.year += 1;
        }
        this.updateView();
    }
}

export default CalendarView;