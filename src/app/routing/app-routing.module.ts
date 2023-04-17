import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ItemListComponent} from "../item-list/item-list.component";
import {ItemComponent} from "../item/item.component";
import {UserComponent} from "../user/user.component";
import {UserListComponent} from "../user-list/user-list.component";
import {ProfileComponent} from "../auth/profile/profile.component";
import {RegisterComponent} from "../auth/register/register.component";
import {LoginComponent} from "../auth/login/login.component";
import {TaskListComponent} from "../task-list/task-list.component";
import {TaskComponent} from "../task/task.component";

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },

  {path: 'items', component: ItemListComponent},
  {path: 'item', component: ItemComponent},
  {path: 'item/:id', component: ItemComponent},

  {path: 'users', component: UserListComponent},
  {path: 'user', component: UserComponent},
  {path: 'user/:id', component: UserComponent},

  {path: 'tasks', component: TaskListComponent},
  {path: 'task', component: TaskComponent},
  {path: 'task/:id', component: TaskComponent},

  {path: '', redirectTo: 'items', pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
