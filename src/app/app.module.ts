import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {PostComponent} from "./post/post.component";
import {FormsModule} from "@angular/forms";
import {PostFormComponent} from './post-form/post-form.component';
import {ItemComponent} from './item/item.component';
import {ItemListComponent} from './item-list/item-list.component';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./routing/app-routing.module";
import {StyleDirective} from "./directives/style.directive";
import {TranslocoRootModule} from './transloco-root.module';
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    PostFormComponent,
    ItemComponent,
    ItemListComponent,
    StyleDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslocoRootModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
