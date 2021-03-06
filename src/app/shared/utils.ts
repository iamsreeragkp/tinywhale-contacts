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
    label: 'Singapore (SG)',
    code: '+65',
  },
  {
    id: 'US',
    name: 'United States of America',
    label: 'United States of America (US)',
    code: '+1',
  },
  {
    id: 'GB',
    name: 'United Kingdom',
    label: 'United Kingdom (GB)',
    code: '+44',
  },
  {
    id: 'AU',
    name: 'Australia',
    label: 'Australia (AU)',
    code: '+61',
  },
  {
    id: 'IN',
    name: 'India',
    label: 'India (IN)',
    code: '+91',
  },
];

export function findWeekDay(day: WeekDay) {
  return Object.keys(WeekDay).find(weekDay => WeekDay[weekDay as keyof typeof WeekDay] === day)!;
}

export const getTimeRangeSerializedBasedOnWeekday = (timeRanges: TimeRange[], grouping = false) => {
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
          if (!coincidingRange || !grouping) {
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

export function getDaysInAMonth(dateString?: string) {
  const dates: string[] = [];
  const tempDate = dateString ? new Date(dateString) : new Date();
  if (tempDate.getTime()) {
    const noOfDays = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
    tempDate.setDate(1);
    for (let i = 1; i <= noOfDays; i++) {
      dates.push(new DatePipe('en').transform(tempDate, 'd MMM, yyyy')!);
      tempDate.setDate(i + 1);
    }
  }
  return dates;
}

export function getNextOrPrevious12Months(
  nextOrPrevious: 'next' | 'previous',
  dateString?: string
) {
  const previous12Months: string[] = [];
  const newDate = dateString ? new Date(dateString) : new Date();
  if (nextOrPrevious === 'previous') {
    newDate.setFullYear(newDate.getFullYear() - 1);
    newDate.setMonth(newDate.getMonth() + 1);
  }
  if (newDate.getTime()) {
    for (let i = 0; i < 12; i++) {
      previous12Months.push(new DatePipe('en').transform(newDate, 'MMM yyyy')!);
      newDate.setMonth(newDate.getMonth() + 1);
    }
  }
  return previous12Months;
}

export function getQuarterMonths(dateString?: string) {
  const quarterMonths: string[] = [];
  const newDate = dateString ? new Date(dateString) : new Date();
  if (newDate.getTime()) {
    const firstMonthOfQuadrant = Math.floor(newDate.getMonth() / 3) * 3;
    newDate.setMonth(firstMonthOfQuadrant);
    quarterMonths.push(
      ...Array.from({ length: 3 }, _ => {
        const dateString = new DatePipe('en').transform(newDate, 'MMMM yyyy') as string;
        newDate.setMonth(newDate.getMonth() + 1);
        return dateString;
      })
    );
  }
  return quarterMonths;
}

export const escapeRegex = (string: string | null, flag: string | undefined = undefined) => {
  let escapedString =
    string?.replace(/([-\/\\*+?.()|[\]{}]|(?<!^)\^|\$(?!$))/g, '\\$&') ?? string ?? '';
  return new RegExp(escapedString, flag);
};

export function nFormatter(num: number) {
  if (isNaN(num)) {
    return num;
  }
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const item = lookup
    .slice()
    .reverse()
    .find(item => num >= item.value);
  if (item?.symbol) {
    return (num / item.value).toFixed(1) + item.symbol;
  }
  return num;
}
