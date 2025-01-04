import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ItemService} from "../item/item.service";
import {Item} from "../item/item";
import {Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";
import {Department} from "../app.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FileUploadService} from "../services/file-upload.service";
import {map} from "rxjs/operators";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})
export class ItemListComponent implements OnInit, AfterViewInit{

  @ViewChild(MatPaginator) paginator: MatPaginator | null;
  @ViewChild(MatSort) sort: MatSort | null;

  items: Item[];
  departments: string[];

  filter = {
    department: '',
    price: null
  }
  sortField = "updated";
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [5, 10, 30];

  columnsToDisplayWithExpand = ['select', 'name', 'description', 'price', 'actions'];
  expandedElement: Item | null;
  dataSource:MatTableDataSource<Item>;
  selection = new SelectionModel<Item>(true, []);
  @Output() saveSelection = new EventEmitter();

  displayAsGrid: boolean = false;

  toggleDisplayMode() {
    this.displayAsGrid = !this.displayAsGrid;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private itemService: ItemService,
              private router: Router,
              private translocoService: TranslocoService,
              private fileUploadService: FileUploadService) {
    this.items = [];
    this.departments = Object.keys(Department);
    this.expandedElement = null;
    this.dataSource = new MatTableDataSource<Item>();
    this.paginator = null;
    this.sort = null;
  }

  ngOnInit(): void {
    // this.getItemsPageWithFilter();
    this.getItems();
  }

  private getItems() {
    this.itemService.getList().subscribe(data => {
      this.items = data;
      this.dataSource.data = data;
      this.loadImagesForItems();
    });
  }

  private loadImagesForItems() {
    const requests = [];

    for (const item of this.items) {
      let itemImageNames = item.imageNames;
      item.imageUrls = [];
      item.images = [];

      for (const imgName of itemImageNames) {
        const request = this.fileUploadService.getFileByName(imgName).pipe(
          map(file => {
            item.imageUrls.push(window.URL.createObjectURL(file));
            item.images.push(file);
          })
        );
        requests.push(request);
      }
    }
    forkJoin(requests).subscribe(() => {
      console.log('Все изображения загружены');
    });
  }

  getItemsPageWithFilter() {
    let requestParams = this.getRequestParams();
    this.itemService.findPageByFilter(requestParams).subscribe(data => {
      this.count = data.totalElements;
      this.items = data.content;
      this.dataSource = data.content;
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
    } else {
      params[`sort`] = 'updated';
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data && this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  addSelected() {
    this.saveSelection.emit(this.selection.selected);
  }
}
