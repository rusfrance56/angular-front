import {Component, OnInit} from '@angular/core';
import {Item} from "../item/item";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user/user.service";
import {ItemService} from "../item/item.service";
import {ValidationService} from "../validation/validation.service";
import {first} from "rxjs";
import {OrderStatus} from "../app.component";
import {CustomerOrder} from "./customer-order";
import {CustomerOrderService} from "./customer-order.service";
import {ItemListModalComponent} from "../item-list-modal/item-list-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html'
})
export class CustomerOrderComponent implements OnInit{
  order: CustomerOrder;
  statuses;
  items: Item[];
  submitted = false;
  loading = false;
  isAddMode!: boolean;
  orderForm!: FormGroup;
  dialogRef: MatDialogRef<ItemListModalComponent> | null;

  constructor(private router: Router,
              private activatedRouter: ActivatedRoute,
              private formBuilder: FormBuilder,
              private orderService: CustomerOrderService,
              private userService: UserService,
              private itemService: ItemService,
              private validationService: ValidationService,
              private dialog: MatDialog) {
    this.order = new CustomerOrder();
    this.statuses = Object.keys(OrderStatus);
    this.items = [];
    this.dialogRef = null;
  }

  ngOnInit(): void {
    let id = this.activatedRouter.snapshot.params['id'];
    this.isAddMode = !id;

    this.orderForm = this.formBuilder.group({
      id: [],
      name: ['', [
        Validators.required
      ]],
      description: [''],
      dueDate: [new Date()],
      status: [OrderStatus.CREATED],
      items: [],
      userId: []
    });

    if (!this.isAddMode) {
      this.orderService.getById(id)
        .pipe(first())
        .subscribe(x => {
          this.orderForm.patchValue(x);
          this.items = x.items;
        });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.orderForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createCustomerOrder();
    } else {
      this.updateCustomerOrder();
    }
  }

  private createCustomerOrder() {
    this.loading = true;
    this.orderService.create(this.orderForm.value)
      .pipe(first())
      .subscribe(() => {
        // this.alertService.success('User added', { keepAfterRouteChange: true });
        this.goToCustomerOrderList();
      })
      .add(() => this.loading = false);
  }

  private updateCustomerOrder() {
    this.loading = true;
    if (this.orderForm.get('items')) {
      // @ts-ignore
      let items = this.orderForm.get('items').value;
      this.orderForm.patchValue({
        items: items.map((i: Item) => i.id)
      });
    }
    this.orderService.update(this.orderForm.value)
      .pipe(first())
      .subscribe(() => {
        // this.alertService.success('User added', { keepAfterRouteChange: true });
        this.goToCustomerOrderList();
      })
      .add(() => this.loading = false);
  }

  private goToCustomerOrderList() {
    this.router.navigate(['/orders'], { relativeTo: this.activatedRouter });
  }

  isFieldInvalid(field: string): boolean {
    return this.submitted && this.validationService.isFieldInvalid(this.orderForm, field);
  }

  getErrorMessage(field: string): string {
    return this.validationService.getErrorMessage(this.orderForm, field, 'order');
  }

  compareAny(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  calculateTotal() {
    if (!this.items) {
      return 0;
    }
    return this.items.reduce(
      (accumulator, current) => accumulator + Number(current["price"]), 0
    );
  };

  deleteItem(itemId: number) {
    if (this.orderForm.get('items')){
      // @ts-ignore
      let items = this.orderForm.get('items').value;
      // let itemToDelete = items.filter((i: Item) => i.id == itemId);

      items.forEach((element: Item, index: number)=>{
        if (element.id == itemId) {
          items.splice(index,1);
        }
      });
      this.orderForm.patchValue({
        items: items
      });
    }
  }

  openModal() {
    this.dialogRef = this.dialog.open(ItemListModalComponent, {width: '1000px'});
    this.dialogRef.updatePosition({ top: '3%', left: '20%' });
    this.dialogRef.componentInstance.saveSelection.subscribe((data: Item[]) => {
      this.items = this.items.concat(data);
      this.orderForm.patchValue({
        items: this.items
      });
      console.log('Выбранные элементы:', data);
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    });
  }
}
