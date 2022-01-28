import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { OptionsType, OptionType } from '../../interfaces/dropdown.interface';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent {
  // input properties
  _options: OptionsType = [];
  _multiSelect = false;
  _showRadio = false;
  _addCustomValue = false;
  _placeholder = 'Select';
  _label = 'Select';
  _displayKey = 'label';
  _idKey = 'id';
  // Options
  @Input() set options(val: OptionsType) {
    this._options = val.map(option => ({
      ...option,
      dropdown_field_data: {
        selected: false,
      },
    }));
  }
  // Whether multi select or not
  @Input() set multiSelect(val: boolean) {
    this._multiSelect = val;
    if (val) {
      this._showRadio = false;
    }
  }
  // Single select radio mode
  @Input() set showRadio(val: boolean) {
    this._showRadio = val;
    if (val) {
      this._multiSelect = false;
    }
  }
  // Allow adding custom values
  @Input() set addCustomValue(val: boolean) {
    this._addCustomValue = val;
  }
  // Placeholder
  @Input() set placeholder(val: string) {
    this._placeholder = val;
  }
  // Label
  @Input() set label(val: string) {
    this._label = val;
  }
  // Previous value setting.
  @Input() set previousValue(val: OptionsType | OptionType) {
    this.setPreviousValues(val);
  }
  // Display key for Options and selected values
  @Input() set displayKey(val: string) {
    this._displayKey = val;
  }
  // Identifier (unique) key
  @Input() set idKey(val: string) {
    this._idKey = val;
  }

  // component properties
  open = false;
  openAddCustomValue = false;
  _isDisabled = false;
  customValueInput = '';

  _onChange = (val: any) => {};
  _onTouched = () => {};
  _validate: (control: AbstractControl) => ValidationErrors | null = control => null;

  // Event emitters
  @Output() selectedValue = new EventEmitter<OptionType | OptionsType>();
  @Output() customValue = new EventEmitter<OptionType>();

  constructor() {}

  // control value accessor functions

  set value(val: any) {}

  writeValue(val: OptionsType | OptionType) {}

  registerOnChange(fn: () => any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => any) {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this._isDisabled = isDisabled;
  }

  validate(validatorFn: (control: AbstractControl) => ValidationErrors | null) {
    this._validate = validatorFn;
  }

  // component functions

  setPreviousValues(val: OptionType | OptionsType) {
    if (val instanceof Array) {
      val.forEach(value => {
        this.selectUnSelectValue(value, false, false);
      });
    } else {
      if (val) {
        this.selectUnSelectValue(val, false, false);
      } else {
        this._options.forEach(option => (option.dropdown_field_data!.selected = false));
      }
    }
  }

  selectUnSelectValue(val: OptionType, unSelect = true, emitEvent = true) {
    this._options.forEach(option => {
      if (option[this._idKey] === val[this._idKey]) {
        option.dropdown_field_data!.selected = !option.dropdown_field_data?.selected || !unSelect;
      } else if (!this._multiSelect) {
        option.dropdown_field_data!.selected = false;
      }
    });
    if (emitEvent) {
      this.selectedValue.emit(this.selectedValues());
    }
    this._onChange(this.selectedValues());
    this._onTouched();
    this.open = !this.open;
  }

  selectCustomValue() {
    if (!this.customValueInput) {
      return;
    }
    const customValue = {
      [this._idKey]: 'CUSTOM_VALUE',
      [this._displayKey]: this.customValueInput,
      dropdown_field_data: {
        selected: true,
      },
    };
    this._options.push(customValue);
    this.customValue.emit(customValue);
    this.open = !this.open;
  }

  selectedValues() {
    return this._options[!this._multiSelect ? 'find' : 'filter'](
      option => option.dropdown_field_data?.selected
    );
  }

  get selectedOption() {
    return this._options.find(option => option.dropdown_field_data?.selected);
  }
}
