import { Directive, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';

/** Fades an element in the first time it scrolls into view. `[rv]="2"` staggers it by two steps (80 ms each). */
@Directive({ selector: '[rv]', standalone: true, host: { class: 'rv' } })
export class RevealDirective implements OnInit, OnDestroy {
  @Input() set rv(step: number | '') { this.el.style.transitionDelay = step ? `${+step * 80}ms` : ''; }
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { this.el.classList.add('rv-in'); this.io.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  ngOnInit(): void { this.io.observe(this.el); }
  ngOnDestroy(): void { this.io.disconnect(); }
}
