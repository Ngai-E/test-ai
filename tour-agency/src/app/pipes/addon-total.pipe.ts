import { Pipe, PipeTransform } from '@angular/core';

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
