import {Component, OnInit} from '@angular/core';
import {ItemService} from "../item/item.service";
import {Item} from "../item/item";
import {Router} from "@angular/router";
import {Department} from "../app.component";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit{

  items: Item[];

  constructor(private itemService: ItemService,
              private router: Router) {
    this.items = [];
  }

  ngOnInit(): void {
    this.getItems();

    if(!this.items) {
      this.items = [{
          id: 1,
          name: "item1",
          description: "desc1",
          imageUrls: [],
          department: Department.OFFICE,
          price: 11111.08
        },
        {
          id: 2,
          name: "item2",
          description: "desc2",
          imageUrls: [],
          department: Department.CUSHIONED,
          price: 431.08
        }
      ];
    }
  }

  private getItems() {
    this.itemService.getItemList().subscribe(data => {
      this.items = data;
    });
  }

  deleteItem(id: number) {
    this.itemService.delete(id).subscribe(data => {
      this.getItems();
    });
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/item', id]);
  }
  navigateToCreate() {
    this.router.navigate(['/item']);
  }
}
