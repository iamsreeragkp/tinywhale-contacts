export interface OptionType {
  [k: string]: any;
  dropdown_field_data?: {
    selected: boolean;
  };
}

export type OptionsType = OptionType[];
