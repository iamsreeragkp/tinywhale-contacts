import { Pipe, PipeTransform } from '@angular/core';
import { TimeRange, WeekDay } from 'src/app/modules/service/shared/service.interface';

@Pipe({
  name: 'groupWeekDays',
})

// Pipe to group WeekDays
export class GroupWeekDaysPipe implements PipeTransform {
  transform(value?: TimeRange[] | null): string {
    if (!value?.length) {
      return '-';
    }
    let marathonLastMember: string = '';
    let everyDay = true;
    const groupedString = Object.entries(WeekDay)
      .reduce((concatStringArr: string[], [key, weekDay], index) => {
        if (value?.some(timeRange => timeRange?.day_of_week === weekDay)) {
          if (marathonLastMember) {
            marathonLastMember = key;
            if (index === 6) {
              return concatStringArr.concat(concatStringArr.length ? ' - ' : '', key);
            }
            return concatStringArr;
          } else {
            marathonLastMember = key;
            return concatStringArr.concat(concatStringArr.length ? ', ' : '', key);
          }
        } else {
          everyDay = false;
          if (marathonLastMember && !concatStringArr.includes(marathonLastMember)) {
            concatStringArr.push(concatStringArr.length ? ' - ' : '', marathonLastMember);
          }
          marathonLastMember = '';
          return concatStringArr;
        }
      }, [])
      .join('');
    if (everyDay) {
      return 'Everyday';
    }
    return groupedString;
  }
}
