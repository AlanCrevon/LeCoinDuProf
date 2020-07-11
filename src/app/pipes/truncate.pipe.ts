import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100, completeWords = true, ellipsis = '...') {
    if (completeWords && value.length > limit) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    console.log(value, value.length, value.length > limit);
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}
