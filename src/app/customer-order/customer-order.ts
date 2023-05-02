import {OrderStatus} from "../app.component";
import {Item} from "../item/item";

export class CustomerOrder {
  id?: number | undefined;
  name: string;
  description: string;
  dueDate: Date;
  status: OrderStatus;
  items: Item[];

  constructor() {
    this.name = '';
    this.description = '';
    this.dueDate = new Date();
    this.status = OrderStatus.CREATED;
    this.items = [];
  }
}
