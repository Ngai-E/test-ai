import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'addonTotal'
})
export class AddonTotalPipe implements PipeTransform {
  transform(addons: any[]): number {
    if (!addons || !addons.length) {
      return 0;
    }
    
    return addons.reduce((total, addon) => {
      return total + (addon.price * addon.quantity);
    }, 0);
  }
}
