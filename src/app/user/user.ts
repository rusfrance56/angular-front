import {Department} from "../app.component";

export class User {
  id?: number | undefined;
  logonName: string;
  name: string;
  surname: string;
  department: Department;
  address: string;
  email: string;
  phone: string;
  // task: List<TaskTO>
  // orders: List<CustomerOrderResponseTO>

  constructor() {
    this.logonName = '';
    this.name = '';
    this.surname = '';
    this.department = Department.OFFICE;
    this.address = '';
    this.email = '';
    this.phone = '';
  }
}
