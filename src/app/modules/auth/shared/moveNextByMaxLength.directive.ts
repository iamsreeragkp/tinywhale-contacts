import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
// eslint-disable-next-line @angular-eslint/directive-selector
selector: '[moveNextByMaxLength]'
})
export class MoveNextByMaxLengthDirective {

constructor(private _el: ElementRef) { }
@HostListener('keyup', ['$event']) onKeyDown(keyboardEvent: KeyboardEvent) {
  const target = keyboardEvent.target as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;

  if (!target || target.maxLength !== target.value.length) return;

  keyboardEvent.preventDefault();

  const { type } = target;
  let { nextElementSibling } = target;

  while (nextElementSibling) {
    if (
      (nextElementSibling as HTMLInputElement | HTMLTextAreaElement).type ===
      type
    ) {
      (nextElementSibling as HTMLInputElement | HTMLTextAreaElement).focus();
      return;
    }

    nextElementSibling = nextElementSibling.nextElementSibling;
  }
}

}
