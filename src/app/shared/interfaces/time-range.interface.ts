import { WeekDay } from 'src/app/modules/service/shared/service.interface';

export interface TimeRangeSerialized {
  label: string;
  ranges: SlotRange[];
  day_of_week: WeekDay;
}

export interface SlotRange {
  start_time: string;
  start_time_label: string;
  end_time: string;
  end_time_label: string;
}

export interface TimeRange {
  class_time_range_id?: number | null;
  day_of_week: WeekDay;
  start_time?: string | null;
  end_time?: string | null;
}
