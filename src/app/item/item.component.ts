import {Component, OnInit} from '@angular/core';
import {Item} from "./item";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "./item.service";
import {Department} from "../app.component";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs";
import {ValidationService} from "../validation/validation.service";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit{
  item: Item;
  departments;
  submitted = false;
  loading = false;
  isAddMode!: boolean;
  itemForm!: FormGroup;

  constructor(private router: Router,
              private activatedRouter: ActivatedRoute,
              private formBuilder: FormBuilder,
              private itemService: ItemService,
              private validationService: ValidationService) {
    this.item = new Item();
    this.departments = Object.keys(Department);
  }

  ngOnInit(): void {
    let id = this.activatedRouter.snapshot.params['id'];
    this.isAddMode = !id;

    this.itemForm = this.formBuilder.group({
      id: [],
      name: ['', [
        Validators.required
      ]],
      description: ['', Validators.maxLength(100)],
      department: [Department.OFFICE, [
        Validators.required
      ]],
      price: [0, [
        Validators.required,
        Validators.pattern(/^([0-9]*)([.][0-9]{1,2})?$/)
      ]],
    });

    if (!this.isAddMode) {
      this.itemService.getById(id)
        .pipe(first())
        .subscribe(x => this.itemForm.patchValue(x));
    }
  }

  onSubmit() {
    console.log(this.itemForm);
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createItem();
    } else {
      this.updateItem();
    }
  }

  private createItem() {
    this.loading = true;
    this.itemService.create(this.itemForm.value)
      .pipe(first())
      .subscribe(() => {
        // this.alertService.success('User added', { keepAfterRouteChange: true });
        this.goToItemList();
      })
      .add(() => this.loading = false);
  }

  private updateItem() {
    this.loading = true;
    this.itemService.update(this.itemForm.value)
      .pipe(first())
      .subscribe(() => {
        // this.alertService.success('User added', { keepAfterRouteChange: true });
        this.goToItemList();
      })
      .add(() => this.loading = false);
  }

  private goToItemList() {
    this.router.navigate(['/items'], { relativeTo: this.activatedRouter });
  }

  onReset(): void {
    this.submitted = false;
    this.itemForm.reset();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.itemForm.controls;
  }

  isFieldInvalid(field: string): boolean {
    return this.submitted && this.validationService.isFieldInvalid(this.itemForm, field);
  }

  getErrorMessage(field: string): string {
    return this.validationService.getErrorMessage(this.itemForm, field, 'item');
  }

}
