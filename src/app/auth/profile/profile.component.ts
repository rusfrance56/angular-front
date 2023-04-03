import {Component, OnInit} from '@angular/core';
import {StorageService} from "../storage.service";
import {UserService} from "../../user/user.service";
import {User} from "../../user/user";
import {first} from "rxjs";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit{
  currentUser: User;
  submitted = false;
  loading = false;
  userForm!: FormGroup;

  constructor(private storageService: StorageService,
              private formBuilder: FormBuilder,
              private userService: UserService) {
    this.currentUser = new User();
  }

  ngOnInit(): void {
    let storageUser = this.storageService.getUser();

    this.userForm = this.formBuilder.group({
      id: [],
      name: ['', [
        Validators.required
      ]],
      surname: ['', [Validators.required]],
      userName: new FormControl({value: '', disabled: true}, Validators.required),
      department: new FormControl({value: null, disabled: true}, Validators.required),
      address: [''],
      email: [''],
      phone: ['']
    });

    this.userService.getById(storageUser.id)
      .pipe(first())
      .subscribe(x => this.userForm.patchValue(x));

  }

  onSubmit() {
    console.log(this.userForm);
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
        // this.goToUserList();
      })
      .add(() => this.loading = false);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }
}
