import {Department} from "../app.component";

export class Item{
  id?: number | undefined;
  name: string;
  description: string;
  imageNames: string[];
  department: Department;
  price: number;
  updated: Date;
  imageUrls: string[];
  images: Blob[];

  constructor() {
    this.name = '';
    this.description = '';
    this.imageNames = [];
    this.department = Department.OFFICE;
    this.price = 0;
    this.updated = new Date();
    this.imageUrls = [];
    this.images = [];
  }
}
