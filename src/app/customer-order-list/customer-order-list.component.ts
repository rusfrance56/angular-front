import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";
import {sortData} from "../app.component";
import {CustomerOrderService} from "../customer-order/customer-order.service";
import {CustomerOrder} from "../customer-order/customer-order";

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html'
})
export class CustomerOrderListComponent {
  orders: CustomerOrder[];

  constructor(private orderService: CustomerOrderService,
              private router: Router,
              private translocoService: TranslocoService) {
    this.orders = [];
  }

  ngOnInit(): void {
    this.getOrders();
  }

  private getOrders() {
    this.orderService.getList().subscribe(data => {
      this.orders = sortData(data);
    });
  }

  deleteOrder(id: number) {
    this.orderService.delete(id).subscribe(() => {
      this.getOrders();
    });
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/order', id]);
  }
  navigateToCreate() {
    this.router.navigate(['/order']);
  }
}
