import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ValidationService} from "../validation/validation.service";
import {Department, TaskPriority, TaskStatus} from "../app.component";
import {first} from "rxjs";
import {Task} from "./task";
import {TaskService} from "./task.service";
import {User} from "../user/user";
import {Item} from "../item/item";
import {UserService} from "../user/user.service";
import {ItemService} from "../item/item.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent {
  task: Task;
  statuses;
  priorities;
  departments;
  users: User[];
  items: Item[];
  submitted = false;
  loading = false;
  isAddMode!: boolean;
  taskForm!: FormGroup;

  constructor(private router: Router,
              private activatedRouter: ActivatedRoute,
              private formBuilder: FormBuilder,
              private taskService: TaskService,
              private userService: UserService,
              private itemService: ItemService,
              private validationService: ValidationService) {
    this.task = new Task();
    this.statuses = Object.keys(TaskStatus);
    this.priorities = Object.keys(TaskPriority);
    this.departments = Object.keys(Department);
    this.users = [];
    this.items = [];
  }

  ngOnInit(): void {
    let id = this.activatedRouter.snapshot.params['id'];
    this.isAddMode = !id;

    this.taskForm = this.formBuilder.group({
      id: [],
      name: ['', [
        Validators.required
      ]],
      description: [''],
      dueDate: [new Date()],
      status: [TaskStatus.NEW],
      priority: [TaskPriority.LOW],
      department: [],
      item: [],
      userId: []
    });

    this.userService.getList().subscribe((data) => {
      this.users = data;
    });
    this.itemService.getList().subscribe((data) => {
      this.items = data;
    });

    if (!this.isAddMode) {
      this.taskService.getById(id)
        .pipe(first())
        .subscribe(x => {
          this.taskForm.patchValue(x);
          this.onChangeDepartment();
        });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createTask();
    } else {
      this.updateTask();
    }
  }

  private createTask() {
    this.loading = true;
    this.taskService.create(this.taskForm.value)
      .pipe(first())
      .subscribe(() => {
        // this.alertService.success('User added', { keepAfterRouteChange: true });
        this.goToTaskList();
      })
      .add(() => this.loading = false);
  }

  private updateTask() {
    this.loading = true;
    this.taskService.update(this.taskForm.value)
      .pipe(first())
      .subscribe(() => {
        // this.alertService.success('User added', { keepAfterRouteChange: true });
        this.goToTaskList();
      })
      .add(() => this.loading = false);
  }

  private goToTaskList() {
    this.router.navigate(['/tasks'], { relativeTo: this.activatedRouter });
  }

  onReset(): void {
    this.submitted = false;
    this.taskForm.reset();
  }

  isFieldInvalid(field: string): boolean {
    return this.submitted && this.validationService.isFieldInvalid(this.taskForm, field);
  }

  getErrorMessage(field: string): string {
    return this.validationService.getErrorMessage(this.taskForm, field, 'task');
  }

  compareAny(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onChangeDepartment() {
    this.userService.getByDepartment(this.taskForm.value.department).subscribe((data) => {
      this.users = data;
    });
    /*this.itemService.getList().subscribe((data) => {
      this.items = data;
    });*/
  }
}
