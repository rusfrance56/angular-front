import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Department} from "../app.component";
import {first} from "rxjs";
import {User} from "./user";
import {UserService} from "./user.service";
import {ValidationService} from "../validation/validation.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{
  user: User;
  departments;
  submitted = false;
  loading = false;
  isAddMode!: boolean;
  userForm!: FormGroup;

  constructor(private router: Router,
              private activatedRouter: ActivatedRoute,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private validationService: ValidationService) {
    this.user = new User();
    this.departments = Object.keys(Department);
  }

  ngOnInit(): void {
    let id = this.activatedRouter.snapshot.params['id'];
    this.isAddMode = !id;

    this.userForm = this.formBuilder.group({
      id: [],
      name: ['', [
        Validators.required
      ]],
      surname: [''],
      userName: ['', [Validators.required]],
      department: [Department.OFFICE],
      address: [''],
      email: [''],
      phone: [''],
      status: ['']
    });

    if (!this.isAddMode) {
      this.userService.getById(id)
        .pipe(first())
        .subscribe(x => this.userForm.patchValue(x));
    } else {
      this.userForm.addControl('password', new FormControl('', Validators.required));
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    this.loading = true;
    this.userService.create(this.userForm.value)
      .pipe(first())
      .subscribe(() => {
        // this.alertService.success('User added', { keepAfterRouteChange: true });
        this.goToUserList();
      })
      .add(() => this.loading = false);
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

  private goToUserList() {
    this.router.navigate(['/users'], { relativeTo: this.activatedRouter });
  }

  onReset(): void {
    this.submitted = false;
    this.userForm.reset();
  }

  isFieldInvalid(field: string): boolean {
    return this.submitted && this.validationService.isFieldInvalid(this.userForm, field);
  }

  getErrorMessage(field: string): string {
    return this.validationService.getErrorMessage(this.userForm, field, 'user');
  }
}
