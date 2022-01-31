import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayJoin',
})
export class ArrayJoinPipe implements PipeTransform {
  transform(value: any[], symbol = ',', key?: string): string {
    if (!value?.length) {
      return '';
    }
    if (key && value[0] instanceof Object) {
      return value.map(obj => obj[key] ?? '').join(symbol);
    }
    return value.join(symbol);
  }
}
