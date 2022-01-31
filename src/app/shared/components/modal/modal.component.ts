import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ModalConfigOptions {
  closeOnOutsideClick?: boolean;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  _closeOnOutsideClick = false;
  @Input() open!: boolean;
  @Input() set modalConfig(val: ModalConfigOptions) {
    Object.entries(val).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        this[`_${key as keyof ModalConfigOptions}`] = value;
      }
    });
  }
  @Output() openChange = new EventEmitter<boolean>();
  constructor() {}
}
