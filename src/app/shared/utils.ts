import { TimeRange, WeekDay } from '../modules/service/shared/service.interface';
import { TimeRangeSerialized } from './interfaces/time-range.interface';

export const timeOptions = ['AM', 'PM'].flatMap(amPm =>
  Array.from({ length: 12 }, (_, i) => (!i ? 12 : i)).flatMap(hour =>
    ['00', '30'].map(minute => ({
      value: `${`${(hour % 12) + (amPm === 'AM' ? 0 : 12)}`.padStart(2, '0')}${minute}`,
      label: `${hour}:${minute} ${amPm}`,
    }))
  )
);

export const currencyList = [
  {
    id: 'USD',
    name: 'United States Dollar',
    symbol: '$',
  },
  {
    id: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
  },
  {
    id: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
  },
  {
    id: 'GBP',
    name: 'Pound Sterling',
    symbol: '£',
  },
  {
    id: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
  },
];

export function findWeekDay(day: WeekDay) {
  return Object.keys(WeekDay).find(weekDay => WeekDay[weekDay as keyof typeof WeekDay] === day)!;
}

export const getTimeRangeSerialized = (timeRanges: TimeRange[]) => {
  return timeRanges?.reduce((timeRangeSerialized: TimeRangeSerialized[], timeRange) => {
    if (!timeRange.day_of_week || !timeRange.start_time || !timeRange.end_time) {
      return timeRangeSerialized;
    }
    const existingTimeRange = timeRangeSerialized.find(
      timeRangeSer => timeRangeSer.day_of_week === timeRange.day_of_week
    );
    if (!existingTimeRange) {
      return timeRangeSerialized.concat({
        label: findWeekDay(timeRange.day_of_week),
        ranges: [
          {
            start_time: timeRange.start_time,
            end_time: timeRange.end_time,
            start_time_label: convert24HrsFormatToAmPm(timeRange.start_time),
            end_time_label: convert24HrsFormatToAmPm(timeRange.end_time),
          },
        ],
        day_of_week: timeRange.day_of_week,
      });
    }
    const coincidingRange = existingTimeRange?.ranges.find(
      range => range.start_time === timeRange?.end_time || range.end_time === timeRange?.start_time
    );
    if (coincidingRange) {
      if (coincidingRange.start_time === timeRange?.end_time) {
        coincidingRange.start_time = timeRange?.start_time;
      } else {
        coincidingRange.end_time = timeRange?.end_time;
      }
    } else {
      existingTimeRange.ranges.push({
        start_time: timeRange.start_time,
        end_time: timeRange.end_time,
        start_time_label: convert24HrsFormatToAmPm(timeRange.start_time),
        end_time_label: convert24HrsFormatToAmPm(timeRange.end_time),
      });
    }
    return timeRangeSerialized;
  }, []) as TimeRangeSerialized[];
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
