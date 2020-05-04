import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'liveFilter'
})
export class LiveFilterPipe implements PipeTransform {

  transform(items: any, search?: string, field?: string): any {
    if (!search) { return items; }
    const lowerSearch = search.toLowerCase();
    return items.filter(item => item[field].toLowerCase().indexOf(lowerSearch) !== -1);
  }

}
