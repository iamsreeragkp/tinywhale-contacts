import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=number]',
})
export class NumberDirective {
  preventNegative = false;
  // private navigationKeys = [
  //   'Backspace',
  //   'Delete',
  //   'Tab',
  //   'Escape',
  //   'Enter',
  //   'Home',
  //   'End',
  //   'ArrowLeft',
  //   'ArrowRight',
  //   'Clear',
  //   'Copy',
  //   'Paste',
  // ];

  constructor(private _el: ElementRef) {
    if (this.inputElement?.min) {
      this.preventNegative = +this.inputElement.min >= 0;
    }
  }
  @Input() preventDecimal = false;
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.preventNegative && !this.preventDecimal) {
      return;
    }

    if (this.preventNegative && e.key === '-') {
      e.preventDefault();
    }

    if (this.preventDecimal && e.key === '.') {
      e.preventDefault();
    }
  }
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipBoardData = event?.clipboardData?.getData('text/plain');
    const invalidPastedInput = !!clipBoardData?.match(/[^\d.-]/g)?.length; // get a digit-only string
    if (
      invalidPastedInput ||
      (this.preventNegative && clipBoardData?.includes('-')) ||
      (this.preventDecimal && clipBoardData?.includes('.'))
    ) {
      event.preventDefault();
    }
  }
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    const textData = event.dataTransfer?.getData('text');
    const invalidDropData = textData?.match(/[^\d.-]/g);
    if (
      invalidDropData ||
      (this.preventNegative && textData?.includes('-')) ||
      (this.preventDecimal && textData?.includes('.'))
    ) {
      event.preventDefault();
    }
  }
  @HostListener('wheel', ['$event'])
  onWheel(eve: WheelEvent) {
    eve.preventDefault();
  }

  get inputElement() {
    return this._el.nativeElement as HTMLInputElement;
  }
}
