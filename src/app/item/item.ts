import {Department} from "../app.component";

export class Item{
  id?: number | undefined;
  name: string;
  description: string;
  imageUrls: string[];
  department: Department;
  price: number
  updated: Date

  constructor() {
    this.name = '';
    this.description = '';
    this.imageUrls = [];
    this.department = Department.OFFICE;
    this.price = 0;
    this.updated = new Date();
  }
}
