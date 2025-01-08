import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ItemComponent} from './item/item.component';
import {ItemListComponent} from './item-list/item-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./routing/app-routing.module";
import {StyleDirective} from "./directives/style.directive";
import {TranslocoRootModule} from './transloco-root.module';
import {UserComponent} from './user/user.component';
import {UserListComponent} from './user-list/user-list.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {ProfileComponent} from './auth/profile/profile.component';
import {AuthInterceptor} from "./auth/auth.interceptor";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TaskComponent} from './task/task.component';
import {TaskListComponent} from './task-list/task-list.component';
import {CustomerOrderComponent} from './customer-order/customer-order.component';
import {CustomerOrderListComponent} from './customer-order-list/customer-order-list.component';
import {ItemListModalComponent} from './item-list-modal/item-list-modal.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DialogModule} from '@angular/cdk/dialog';
import {MaterialModule} from "./material.module";
import {ImageCarouselComponent} from './image-carousel/image-carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ItemListComponent,
    StyleDirective,
    UserComponent,
    UserListComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    TaskComponent,
    TaskListComponent,
    CustomerOrderComponent,
    CustomerOrderListComponent,
    ItemListModalComponent,
    ImageCarouselComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslocoRootModule,
    // NoopAnimationsModule,
    DialogModule,
    NgbModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
