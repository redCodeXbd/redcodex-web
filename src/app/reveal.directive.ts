import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

/** Fades an element in the first time it scrolls into view. */
@Directive({ selector: '[rv]', standalone: true, host: { class: 'rv' } })
export class RevealDirective implements OnInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { this.el.classList.add('rv-in'); this.io.disconnect(); } }, { threshold: 0.12 });
  ngOnInit(): void { this.io.observe(this.el); }
  ngOnDestroy(): void { this.io.disconnect(); }
}
