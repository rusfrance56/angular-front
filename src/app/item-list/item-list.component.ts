import {Component, OnInit} from '@angular/core';
import {ItemService} from "../item/item.service";
import {Item} from "../item/item";
import {Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit{

  items: Item[];

  filter = {
    department: '',
    price: null
  }
  sortField = "updated";
  page = 1;
  count = 0;
  pageSize = 9;
  pageSizes = [3, 6, 9];

  constructor(private itemService: ItemService,
              private router: Router,
              private translocoService: TranslocoService) {
    this.items = [];
  }

  ngOnInit(): void {
    this.getItemsPageWithFilter();
  }

  private getItems() {
    this.itemService.getList().subscribe(data => {
      this.items = data;
    });
  }

  getItemsPageWithFilter() {
    let requestParams = this.getRequestParams();
    this.itemService.findPageByFilter(requestParams).subscribe(data => {
      this.count = data.totalElements;
      this.items = data.content;
    });
  }

  deleteItem(id: number) {
    this.itemService.delete(id).subscribe(() => {
      this.getItemsPageWithFilter();
    });
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/item', id]);
  }
  navigateToCreate() {
    this.router.navigate(['/item']);
  }

  private getRequestParams(): any {
    let params: any = {};
    let direction: string = "DESC";

    if (this.filter.department) {
      params[`department`] = this.filter.department.toUpperCase();
    }
    if (this.filter.price) {
      params[`price`] = this.filter.price;
    }
    if (this.sortField) {
      params[`sort`] = this.sortField;
    }
    if (this.page) {
      params[`page`] = this.page - 1;
    }
    if (this.pageSize) {
      params[`size`] = this.pageSize;
    }
    if (direction) {
      params[`dir`] = direction;
    }
    return params;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getItemsPageWithFilter();
  }

  setFirstPageAndLoad(): void {
    this.page = 1;
    this.getItemsPageWithFilter();
  }
}
