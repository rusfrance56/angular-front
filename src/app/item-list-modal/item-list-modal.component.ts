import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Item} from "../item/item";

@Component({
  selector: 'app-item-list-modal',
  templateUrl: './item-list-modal.component.html',
  styleUrls: ['./item-list-modal.component.css']
})
export class ItemListModalComponent {
  @Output() saveSelection = new EventEmitter<Item[]>();

  constructor(public dialogRef: MatDialogRef<ItemListModalComponent>) {
  }

  saveSelectedElements(elements: Item[]) {
    this.saveSelection.emit(elements);
  }
}
