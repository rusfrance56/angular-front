import {Component} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-item-list-modal',
  templateUrl: './item-list-modal.component.html',
  styleUrls: ['./item-list-modal.component.css']
})
export class ItemListModalComponent {

  constructor(public modalRef: MdbModalRef<ItemListModalComponent>) {

  }


}
