import {Department, TaskPriority, TaskStatus} from "../app.component";
import {Item} from "../item/item";

export class Task {
  id?: number | undefined;
  name: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  department: Department;
  item: Item | null;
  // customer_order: CustomerOrder;

  constructor() {
    this.name = '';
    this.description = '';
    this.dueDate = new Date();
    this.status = TaskStatus.NEW;
    this.priority = TaskPriority.LOW;
    this.department = Department.OFFICE;
    this.item = null;
  }
}
