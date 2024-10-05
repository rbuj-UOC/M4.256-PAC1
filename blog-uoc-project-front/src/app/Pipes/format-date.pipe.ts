import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date, ...args: number[]): unknown {
    // TODO 1
    if (args.length == 1) {
      if (args[0] == 1) {
        return formatDate(value, 'ddMMyyyy', 'en');
      } else if (args[0] == 2) {
        return formatDate(value, 'dd / MM / yyyy', 'en');
      } else if (args[0] == 3) {
        return formatDate(value, 'dd/MM/yyyy', 'en');
      } else if (args[0] == 4) {
        return formatDate(value, 'yyyy-MM-dd', 'en');
      }
    }
    return null;
  }
}
