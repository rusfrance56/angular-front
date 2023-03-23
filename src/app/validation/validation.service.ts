import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {TranslocoService} from "@ngneat/transloco";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private translocoService: TranslocoService) { }

  isFieldInvalid(form: FormGroup, field: string ): boolean {
      // @ts-ignore
      return !form.get(field).valid && form.get(field).touched;
  }

  getErrorMessage(form: FormGroup, field: string, entityType: string): string {
    let message = '';
    const control = form.get(field);
    // @ts-ignore
    const params = Object.values(control.errors)[0];
    // @ts-ignore
    let firstErrorKey = Object.keys(control.errors)[0];
    if (!firstErrorKey) {
      return message;
    }
    let resultKeyOfException = entityType.concat('.').concat(field).concat('.').concat(firstErrorKey);
    message = this.translocoService.translate(resultKeyOfException, params);
    /*switch (resultKeyOfException) {
      case 'item.name.required': {
        message = this.translocoService.translate('ITEM_NAME_IS_REQ');
        break;
      }
      case 'item.price.required': {
        message = this.translocoService.translate('ITEM_PRICE_IS_REQ');
        break;
      }
      case 'item.price.pattern': {
        message = this.translocoService.translate('ITEM_PRICE_MUST_BE_POSITIVE');
        break;
      }
      default: {
        break;
      }
    }*/
    return message;
  }

}
