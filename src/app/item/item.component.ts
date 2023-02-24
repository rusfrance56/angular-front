import {Component, OnInit} from '@angular/core';
import {Item} from "./item";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "./item.service";
import {Department} from "../app.component";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit{
  item: Item;
  departments;

  constructor(private router: Router,
              private activatedRouter: ActivatedRoute,
              private itemService: ItemService) {
    this.item = new Item();
    this.departments = Object.keys(Department);
  }

  ngOnInit(): void {
    let id = this.activatedRouter.snapshot.params['id'];
    if(id){
      this.itemService.getItemById(id).subscribe(data => {
        this.item = data;
      });
    }
  }

  onSubmit(item: Item) {
    if (item.id) {
      this.itemService.update(item).subscribe(result => this.goToItemList());
    } else {
      this.itemService.save(item).subscribe(result => this.goToItemList());
    }
  }

  private goToItemList() {
    this.router.navigate(['/items']);
  }
}
