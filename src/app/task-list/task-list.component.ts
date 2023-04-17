import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";
import {MatTableDataSource} from "@angular/material/table";
import {sortData} from "../app.component";
import {Task} from '../task/task';
import {TaskService} from "../task/task.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  tasks: Task[];
  dataSource;

  constructor(private taskService: TaskService,
              private router: Router,
              private translocoService: TranslocoService) {
    this.tasks = [];
    this.dataSource = new MatTableDataSource(this.tasks);
  }

  ngOnInit(): void {
    this.getTasks();
  }

  private getTasks() {
    this.taskService.getList().subscribe(data => {
      this.tasks = sortData(data);
    });
  }

  deleteTask(id: number) {
    this.taskService.delete(id).subscribe(() => {
      this.getTasks();
    });
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/task', id]);
  }
  navigateToCreate() {
    this.router.navigate(['/task']);
  }
}
