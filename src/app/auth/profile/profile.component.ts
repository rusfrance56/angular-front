import {Component, OnInit} from '@angular/core';
import {StorageService} from "../storage.service";
import {UserService} from "../../user/user.service";
import {User} from "../../user/user";
import {first} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../validation/validation.service";
import {Department} from "../../app.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit{
  currentUser: User;
  submitted = false;
  loading = false;
  userForm!: FormGroup;
  departments;

  constructor(private router: Router,
              private activatedRouter: ActivatedRoute,
              private storageService: StorageService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private validationService: ValidationService) {
    this.currentUser = new User();
    this.departments = Object.keys(Department);
  }

  ngOnInit(): void {
    let storageUser = this.storageService.getUser();

    this.userForm = this.formBuilder.group({
      id: [],
      name: ['', [
        Validators.required
      ]],
      surname: ['', [Validators.required]],
      userName: new FormControl({value: '', disabled: false}, Validators.required),
      department: new FormControl({value: Department.OFFICE, disabled: false}, Validators.required),
      address: [''],
      email: [''],
      phone: ['']
    });

    this.userService.getById(storageUser.id)
      .pipe(first())
      .subscribe(x => this.userForm.patchValue(x));

  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    this.updateUser();
  }

  private updateUser() {
    this.loading = true;
    this.userService.update(this.userForm.value)
      .pipe(first())
      .subscribe(() => {
        // this.alertService.success('User added', { keepAfterRouteChange: true });
        this.goToUserList();
      })
      .add(() => this.loading = false);
  }

  isFieldInvalid(field: string): boolean {
    return this.submitted && this.validationService.isFieldInvalid(this.userForm, field);
  }

  getErrorMessage(field: string): string {
    return this.validationService.getErrorMessage(this.userForm, field, 'user');
  }

  private goToUserList() {
    this.router.navigate(['/users'], { relativeTo: this.activatedRouter });
  }
}
