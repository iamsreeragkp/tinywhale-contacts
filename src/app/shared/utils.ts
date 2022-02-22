import { DatePipe } from '@angular/common';
import { LocationType, TimeRange, WeekDay } from '../modules/service/shared/service.interface';
import {
  SlotRange,
  TimeRangeSerialized,
  TimeRangeSerializedDate,
} from './interfaces/time-range.interface';

export const timeOptions = ['AM', 'PM'].flatMap(amPm =>
  Array.from({ length: 12 }, (_, i) => (!i ? 12 : i)).flatMap(hour =>
    ['00', '30'].map(minute => ({
      value: `${`${(hour % 12) + (amPm === 'AM' ? 0 : 12)}`.padStart(2, '0')}${minute}`,
      label: `${hour}:${minute} ${amPm}`,
    }))
  )
);

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  country: string;
}

export const currencyList: Currency[] = [
  {
    id: 'SGD',
    name: 'Singapore Dollar (SGD)',
    symbol: 'S$',
    country: 'SG',
  },
  {
    id: 'USD',
    name: 'US Dollar (USD)',
    symbol: '$',
    country: 'US',
  },
  {
    id: 'GBP',
    name: 'Pound Sterling (GBP)',
    symbol: '£',
    country: 'GB',
  },
  {
    id: 'AUD',
    name: 'Australian Dollar (AUD)',
    symbol: 'A$',
    country: 'AU',
  },
  {
    id: 'INR',
    name: 'Indian Rupee (INR)',
    symbol: '₹',
    country: 'IN',
  },
];

export const countryList = [
  {
    id: 'SG',
    name: 'Singapore',
  },
  {
    id: 'US',
    name: 'United States of America',
  },
  {
    id: 'GB',
    name: 'United Kingdom',
  },
  {
    id: 'AU',
    name: 'Australia',
  },
  {
    id: 'IN',
    name: 'India',
  },
];

export function findWeekDay(day: WeekDay) {
  return Object.keys(WeekDay).find(weekDay => WeekDay[weekDay as keyof typeof WeekDay] === day)!;
}

export const getTimeRangeSerializedBasedOnWeekday = (timeRanges: TimeRange[]) => {
  if (!timeRanges) {
    return [];
  }
  return Object.entries(WeekDay).reduce(
    (timeRangeSerialized: TimeRangeSerialized[], [weekDayName, weekDay]) => {
      const timeRangesOfWeekDay = timeRanges
        .filter(
          timeRange =>
            timeRange.day_of_week === weekDay &&
            timeRange.day_of_week &&
            timeRange.start_time &&
            timeRange.end_time
        )
        .sort((a, b) => a.start_time?.localeCompare(b.start_time!)!);
      if (!timeRangesOfWeekDay.length) {
        return timeRangeSerialized;
      }
      return timeRangeSerialized.concat({
        label: weekDayName,
        ranges: timeRangesOfWeekDay.reduce((timeRangeArr: SlotRange[], timeRange) => {
          const coincidingRange = timeRangeArr.find(
            tR => tR.start_time === timeRange.end_time || tR.end_time === timeRange.start_time
          );
          if (!coincidingRange) {
            return timeRangeArr.concat({
              start_time: timeRange.start_time as string,
              end_time: timeRange.end_time as string,
              start_time_label: convert24HrsFormatToAmPm(timeRange.start_time),
              end_time_label: convert24HrsFormatToAmPm(timeRange.end_time),
            });
          }
          if (coincidingRange.start_time === timeRange?.end_time) {
            coincidingRange.start_time = timeRange?.start_time!;
            coincidingRange.start_time_label = convert24HrsFormatToAmPm(timeRange.start_time);
          } else {
            coincidingRange.end_time = timeRange?.end_time!;
            coincidingRange.end_time_label = convert24HrsFormatToAmPm(timeRange.end_time);
          }
          return timeRangeArr;
        }, []),
        day_of_week: weekDay,
      });
    },
    []
  );
  // return timeRanges?.reduce((timeRangeSerialized: TimeRangeSerialized[], timeRange) => {
  //   if (! || ! || !) {
  //     return timeRangeSerialized;
  //   }
  //   const existingTimeRange = timeRangeSerialized.find(
  //     timeRangeSer => timeRangeSer.day_of_week === timeRange.day_of_week
  //   );
  //   if (!existingTimeRange) {
  //     return timeRangeSerialized.concat({
  //       label: findWeekDay(timeRange.day_of_week),
  //       ranges: [
  //         {
  //           start_time: timeRange.start_time,
  //           end_time: timeRange.end_time,
  //           start_time_label: convert24HrsFormatToAmPm(timeRange.start_time),
  //           end_time_label: convert24HrsFormatToAmPm(timeRange.end_time),
  //         },
  //       ],
  //       day_of_week: timeRange.day_of_week,
  //     });
  //   }
  //   const coincidingRange = existingTimeRange?.ranges.find(
  //     range => range.start_time === timeRange?.end_time || range.end_time === timeRange?.start_time
  //   );
  //   if (coincidingRange) {
  //     if (coincidingRange.start_time === timeRange?.end_time) {
  //       coincidingRange.start_time = timeRange?.start_time;
  //     } else {
  //       coincidingRange.end_time = timeRange?.end_time;
  //     }
  //   } else {
  //     existingTimeRange.ranges.push({
  //       start_time: timeRange.start_time,
  //       end_time: timeRange.end_time,
  //       start_time_label: convert24HrsFormatToAmPm(timeRange.start_time),
  //       end_time_label: convert24HrsFormatToAmPm(timeRange.end_time),
  //     });
  //   }
  //   return timeRangeSerialized;
  // }, []) as TimeRangeSerialized[];
};

export const getTimeRangeSerializedBasedOnDate = (
  sessions: { date: string; timeRange: TimeRange }[],
  group = false
) => {
  if (!sessions) {
    return [];
  }
  return sessions
    ?.sort((a, b) => a.date?.localeCompare(b.date))
    ?.reduce((timeRangeSerialized: TimeRangeSerializedDate[], { date, timeRange }) => {
      if (!date || !timeRange.start_time || !timeRange.end_time) {
        return timeRangeSerialized;
      }
      const dateString = new DatePipe('en').transform(new Date(date), 'd MMM') as string;
      const existingTimeRange = timeRangeSerialized.find(
        timeRangeSer =>
          timeRangeSer.label === dateString && timeRange.class_time_range_id !== timeRangeSer.id
      );
      if (!group || !existingTimeRange) {
        return timeRangeSerialized.concat({
          id: timeRange.class_time_range_id,
          label: dateString,
          ranges: [
            {
              start_time: timeRange.start_time!,
              end_time: timeRange.end_time!,
              start_time_label: convert24HrsFormatToAmPm(timeRange.start_time),
              end_time_label: convert24HrsFormatToAmPm(timeRange.end_time),
            },
          ],
          day_of_week: timeRange.day_of_week,
        });
      }
      const coincidingRange = existingTimeRange?.ranges.find(
        range =>
          range.start_time === timeRange?.end_time || range.end_time === timeRange?.start_time
      );
      if (coincidingRange) {
        if (coincidingRange.start_time === timeRange?.end_time) {
          coincidingRange.start_time = timeRange?.start_time;
          coincidingRange.start_time_label = convert24HrsFormatToAmPm(timeRange?.start_time);
        } else {
          coincidingRange.end_time = timeRange?.end_time!;
          coincidingRange.end_time_label = convert24HrsFormatToAmPm(timeRange?.end_time);
        }
      } else {
        existingTimeRange.ranges.push({
          start_time: timeRange.start_time!,
          end_time: timeRange.end_time!,
          start_time_label: convert24HrsFormatToAmPm(timeRange.start_time),
          end_time_label: convert24HrsFormatToAmPm(timeRange.end_time),
        });
      }
      return timeRangeSerialized;
    }, []) as TimeRangeSerializedDate[];
};

export function convert24HrsFormatToAmPm(time?: string | null) {
  if (!time) {
    return '';
  }
  const [endHour, minute] = time.match(/\d{2}/g)!;
  let amPm = 'AM';
  let hour = endHour;
  if (+endHour >= 12) {
    amPm = 'PM';
  }
  if (+endHour > 12) {
    hour = (+endHour - 12).toString().padStart(2, '0');
  } else if (+endHour === 0) {
    hour = '12';
  }
  return `${hour}:${minute} ${amPm}`;
}
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const weekDayOptions = weekDays.map(weekDay => ({
  value: WeekDay[weekDay as keyof typeof WeekDay],
  label: weekDay,
  selected: false,
}));
export const weekDayFilterOptions = weekDays.map(weekDay => ({
  value: WeekDay[weekDay as keyof typeof WeekDay],
  label: weekDay.substring(0, 3),
  selected: false,
}));

export const locationOptions = [
  {
    location_id: LocationType.CUSTOMER_LOCATION,
    location_type: LocationType.CUSTOMER_LOCATION,
    location_name: "Customer's Location",
  },
  // {
  //   location_id: LocationType.ONLINE,
  //   location_type: LocationType.ONLINE,
  //   location_name: 'Online (Zoom - connect)',
  // },
];

export const locationFilterOptions = [
  {
    id: LocationType.CUSTOMER_LOCATION,
    label: "Customer's Location",
  },
  {
    id: LocationType.BUSINESS_LOCATION,
    label: 'Business Location',
  },
];

export function convertDateToDateString(date?: Date | string | null) {
  const dateObj = new Date(date ?? new Date());
  return `${dateObj.getFullYear()}-${`${dateObj.getMonth() + 1}`.padStart(
    2,
    '0'
  )}-${`${dateObj.getDate()}`.padStart(2, '0')}`;
}
