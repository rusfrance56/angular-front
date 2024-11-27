import {Component, OnInit} from '@angular/core';
import {Item} from "./item";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "./item.service";
import {Department} from "../app.component";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs";
import {ValidationService} from "../validation/validation.service";
import {FileUploadService} from "../services/file-upload.service";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  item: Item;
  departments: string[];
  submitted = false;
  loading = false;
  isAddMode!: boolean;
  itemForm!: FormGroup;

  constructor(private router: Router,
              private activatedRouter: ActivatedRoute,
              private formBuilder: FormBuilder,
              private itemService: ItemService,
              private validationService: ValidationService,
              private fileUploadService: FileUploadService
  ) {
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
      image: new FormControl(null),
      imageUrl: new FormControl<string | Blob>('')
    });

    if (!this.isAddMode) {
      this.itemService.getById(id)
        .pipe(first())
        .subscribe(x => this.itemForm.patchValue(x));
    }
  }

  onSubmit() {
    // console.log(this.itemForm);
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }
    this.saveImages();

    this.loading = true;
    /* if (this.isAddMode) {
       this.createItem();
     } else {
       this.updateItem();
     }*/
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

  private saveImages() {
    let image = this.itemForm.controls['image'].value;
    if (image) {
      let imageArray = [image];
      imageArray.forEach(() => {
        this.fileUploadService.saveFile(image).subscribe(stringResponse => {
          // this.itemForm.patchValue({imageUrl: stringResponse.response});
          this.fileUploadService.getFileByName(stringResponse.response).subscribe(file => {
            const url = window.URL.createObjectURL(file);
            this.itemForm.patchValue({imageUrl: url});
          });
        });
      });
    }
  }

  private goToItemList() {
    this.router.navigate(['/items'], {relativeTo: this.activatedRouter});
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

  protected onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.itemForm.patchValue({image: file});
      this.itemForm.patchValue({imageUrl: URL.createObjectURL(file)});
    }
  }

  protected getImageFullUrl() {
    // @ts-ignore
    let itemValue = this.itemForm.controls.imageUrl.value;
    return itemValue || null;
  }
}
