import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value) {
      const newValue = Number(value);

      const hrs = ~~(newValue / 3600);
      const mins = ~~((newValue % 3600) / 60);
      const secs = ~~newValue % 60;

      let formatedValue = '';

      if (hrs > 0) formatedValue += '' + hrs + ':' + (mins < 10 ? '0' : '');

      formatedValue += '' + mins + ':' + (secs < 10 ? '0' : '');
      formatedValue += '' + secs;

      return formatedValue;
    } else return '0:00';
  }
}
