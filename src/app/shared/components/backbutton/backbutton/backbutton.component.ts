import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-back-button',
  templateUrl: './backbutton.component.html',
  styleUrls: ['./backbutton.component.scss'],
})
export class BackbuttonComponent {
  open = false;
  _actions: string[] = [];
  @Input() isDisabled: Boolean = false;
  @ViewChild('threeDots') threeDots!: ElementRef<HTMLDivElement>;
  @Input() set actions(val: string[]) {
    this._actions = val;
  }
  @Output() actionTriggered = new EventEmitter<string>();

  @HostListener('document:click', ['$event']) onClick({ target }: { target: HTMLElement }) {
    if (!this.open) {
      return;
    }
    if (!this.threeDots.nativeElement.contains(target)) {
      this.open = false;
    }
    // const dropDownSelector = 'div.' + this.dropdown.nativeElement.className.split(' ').join('.');
    // if (!target.closest(dropDownSelector)) {
    //   this.open = false;
    // }
  }

  constructor() {}
}
