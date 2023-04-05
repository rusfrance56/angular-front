import {Component, OnInit} from '@angular/core';
import {ItemService} from "../item/item.service";
import {Item} from "../item/item";
import {Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";
import {MatTableDataSource} from "@angular/material/table";
import {sortData} from "../app.component";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit{

  items: Item[];
  columnsToDisplay = ['name'];
  dataSource;

  constructor(private itemService: ItemService,
              private router: Router,
              private translocoService: TranslocoService) {
    this.items = [];
    this.dataSource = new MatTableDataSource(this.items);
  }

  ngOnInit(): void {
    this.getItems();
  }

  private getItems() {
    this.itemService.getList().subscribe(data => {
      this.items = sortData(data);
    });
  }

  deleteItem(id: number) {
    this.itemService.delete(id).subscribe(() => {
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
