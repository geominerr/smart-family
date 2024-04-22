import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appOutsideClick]',
  standalone: true,
})
export class OutsideClickDirective {
  @Output() outsideClick: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: PointerEvent) {
    const insideClick = this.elemRef.nativeElement.contains(event.target);

    if (!insideClick) {
      this.outsideClick.emit();
    }
  }

  constructor(private elemRef: ElementRef) {}
}
