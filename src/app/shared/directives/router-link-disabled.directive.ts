import { Directive, Input, Optional, ElementRef, OnChanges, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkWithHref } from '@angular/router';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[routerLink][disabled]'
})
export class RouterLinkDisabledDirective implements OnChanges {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('disabled') public isDisabled: boolean = false;

  constructor(
    @Optional() routerLink: RouterLink,
    @Optional() routerLinkWithHref: RouterLinkWithHref,
    public elementRef: ElementRef,
    public renderer: Renderer2
  ) {
    const link =  routerLink ?? routerLinkWithHref;
    const onClick = link.onClick;

    link.onClick = (...args: unknown[] | any): boolean => {
      if (this.isDisabled) {
        return !routerLinkWithHref;
      }

      return onClick.apply(link, args);
    };
  }

  ngOnChanges() {
    // TODO: check if `isDisabled` was changed
    this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled',this.isDisabled.toString());
  }
}
