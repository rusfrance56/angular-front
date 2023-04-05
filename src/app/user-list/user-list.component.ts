import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../user/user.service";
import {User} from "../user/user";
import {sortData} from "../app.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{
  users: User[];
  columnsToDisplay = ['name'];
  dataSource;

  constructor(private userService: UserService,
              private router: Router,
              private translocoService: TranslocoService) {
    this.users = [];
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers() {
    this.userService.getList().subscribe(data => {
      this.users = sortData(data);
    });
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe(() => {
      this.getUsers();
    });
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/user', id]);
  }
  navigateToCreate() {
    this.router.navigate(['/user']);
  }
}
