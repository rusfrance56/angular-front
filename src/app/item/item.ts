import {Department} from "../app.component";

export class Item{
  id?: number | undefined;
  name: string;
  description: string;
  imageUrls: string[];
  department: Department;
  price: number

  constructor() {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.imageUrls = [];
    this.department = Department.OFFICE;
    this.price = 0;
  }
}
