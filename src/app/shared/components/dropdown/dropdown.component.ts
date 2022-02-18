import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
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
  _emitId = false;
  _closableChip = true;
  // Options
  @Input() set options(val: OptionsType) {
    const previousSelectedValues = JSON.stringify(this.selectedValues());
    if (val?.length) {
      this._options = JSON.parse(JSON.stringify(val)).map((option: OptionType) => ({
        ...option,
        dropdown_field_data: {
          selected:
            this._options?.find(oldOption => oldOption[this._idKey] === option[this._idKey])
              ?.dropdown_field_data?.selected ?? false,
        },
      }));
    } else {
      this._options = [];
    }
    if (previousSelectedValues !== JSON.stringify(this.selectedValues())) {
      this.emitValues();
    }
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
  // Emit the of the object instead of object
  @Input() set emitId(val: boolean) {
    this._emitId = val;
  }
  // Closable chip view multiselect
  @Input() set closableChip(val: boolean) {
    this._closableChip = false;
  }

  // component properties
  open = false;
  openAddCustomValue = false;
  _isDisabled = false;
  customValueInput = '';
  @ViewChild('dropdown') dropdown!: ElementRef<HTMLDivElement>;
  @HostListener('document:click', ['$event']) onClick({ target }: { target: HTMLElement }) {
    if (!this.open) {
      return;
    }
    if (!this.dropdown.nativeElement.contains(target)) {
      this.openCloseDropdown();
    }
    // const dropDownSelector = 'div.' + this.dropdown.nativeElement.className.split(' ').join('.');
    // if (!target.closest(dropDownSelector)) {
    //   this.open = false;
    // }
  }

  _onChange = (val: any) => {};
  _onTouched = () => {};
  _validate: (control: AbstractControl) => ValidationErrors | null = control => null;

  // Event emitters
  @Output() selectedValue = new EventEmitter<OptionType | OptionsType>();

  constructor() {}

  // control value accessor functions

  set value(val: any) {}

  writeValue(val: OptionsType | OptionType) {
    this.setPreviousValues(val);
  }

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

  openCloseDropdown() {
    if (this._isDisabled) {
      return;
    }
    this.open = !this.open;
    if (!this.open) {
      this._onTouched();
    }
  }

  setPreviousValues(val: any) {
    if (val instanceof Array) {
      let valArr = val;
      if (this._emitId) {
        valArr = val.map(id => this._options.find(option => option[this._idKey] === id));
      }
      valArr.forEach(value => {
        this.selectUnSelectValue(value, false);
      });
    } else {
      if (val) {
        let valObj = val;
        if (this._emitId) {
          valObj = this._options.find(option => option[this._idKey] === val);
        }
        this.selectUnSelectValue(valObj, false);
      } else {
        this._options.forEach(option => (option.dropdown_field_data!.selected = false));
      }
    }
  }

  selectUnSelectValue(val: OptionType, emitEvent = true) {
    this._options.forEach(option => {
      if (option[this._idKey] === val[this._idKey]) {
        option.dropdown_field_data!.selected =
          !option.dropdown_field_data?.selected || (!this._multiSelect && !this.showRadio);
      } else if (!this._multiSelect) {
        option.dropdown_field_data!.selected = false;
      }
    });
    if (emitEvent) {
      this.emitValues();
      this._onTouched();
    }
    if (!this._multiSelect) {
      this.open = false;
    }
  }

  selectCustomValue() {
    if (!this.customValueInput) {
      return;
    }
    this._options.forEach(option => {
      option.dropdown_field_data!.selected = false;
    });
    const customValue = {
      [this._idKey]: Symbol('CUSTOM_VALUE'),
      [this._displayKey]: this.customValueInput,
      dropdown_field_data: {
        selected: true,
        custom_value: true,
      },
    };
    this._options.push(customValue);
    this.emitValues();
    this._onTouched();
    this.openAddCustomValue = false;
    this.customValueInput = '';
    this.open = !this.open;
  }

  selectedValues(skipIdEmit = false) {
    const values =
      this._options[!this._multiSelect ? 'find' : 'filter'](
        option => option.dropdown_field_data?.selected
      ) ?? null;
    if (this._emitId && !skipIdEmit) {
      if (values instanceof Array) {
        return values.map(option => option[this._idKey]);
      } else {
        return values?.[this._idKey] ?? null;
      }
    }
    return values;
  }

  emitValues() {
    const values = this.selectedValues();
    this.selectedValue.emit(values);
    this._onChange(values);
  }

  get selectedOption() {
    return this._options.find(option => option.dropdown_field_data?.selected);
  }
}
