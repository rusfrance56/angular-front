import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ItemListComponent} from "../item-list/item-list.component";
import {ItemComponent} from "../item/item.component";

const routes: Routes = [
  {path: 'items', component: ItemListComponent},
  {path: 'item', component: ItemComponent},
  {path: 'item/:id', component: ItemComponent},
  {path: '', redirectTo: 'items', pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
