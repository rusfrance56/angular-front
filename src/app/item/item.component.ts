import {Component, OnInit} from '@angular/core';
import {Item} from "./item";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "./item.service";
import {Department} from "../app.component";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first, firstValueFrom} from "rxjs";
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
      images: this.formBuilder.array<Blob>([]),
      imageUrls: this.formBuilder.array<string>([]),
      imageNames: this.formBuilder.array<string>([])
    });

    if (!this.isAddMode) {
      this.itemService.getById(id)
        .pipe(first())
        .subscribe(x => {
          this.itemForm.patchValue(x);

          //   TODO как будто бы тут нужно загружать массивы ссылок и картинок как FormControl
          let imageNames = x.imageNames;
          for (const image of imageNames) {
            this.fileUploadService.getFileByName(image).subscribe(file => {
              // this.images.value.push(file);
              this.imageUrls.value.push(window.URL.createObjectURL(file));

              const imgControl = this.formBuilder.control(file, Validators.required);
              this.images.push(imgControl);
            });
          }
        });
    }
  }

  protected onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length) {
      this.images.clear();
      this.imageUrls.reset();
      this.imageNames.reset();
      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        if (file) {
          this.images.value.push(file);
          this.imageUrls.value.push(URL.createObjectURL(file));
        }
      }
    }
  }

  async onSubmit() {
    // console.log(this.itemForm);
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }
    await this.saveImages();

    this.loading = true;
    if (this.isAddMode) {
      this.createItem();
    } else {
      this.updateItem();
    }
  }

  saveImages(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let imageArr = this.itemForm.controls['images'].value;
      if (imageArr && imageArr.length > 0) {
        try {
          for (const image of imageArr) {
            const stringResponse = await firstValueFrom(this.fileUploadService.saveFile(image));
            this.imageNames.value.push(stringResponse.response);
            /* this.fileUploadService.getFileByName(stringResponse.response).subscribe(file => {
              this.images.value.push(window.URL.createObjectURL(file));
             });*/
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      }
      resolve();
    });
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

  get images(): FormArray {
    return this.itemForm.get('images') as FormArray;
  }

  get imageUrls(): FormArray {
    return this.itemForm.get('imageUrls') as FormArray;
  }

  get imageNames(): FormArray {
    return this.itemForm.get('imageNames') as FormArray;
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

  protected getImageFullUrl() {
    // @ts-ignore
    let itemValue = this.itemForm.controls.imageUrl.value;
    return itemValue || null;
  }
}
