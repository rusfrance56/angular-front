import {Department} from "../app.component";
import {Role} from "./role";

export class AuthUser {
  id?: number | undefined;
  userName: string;
  department: Department;
  userRoles: Set<Role>;

  constructor() {
    this.userName = '';
    this.department = Department.OFFICE;
    this.userRoles = new Set<Role>();
  }
}
