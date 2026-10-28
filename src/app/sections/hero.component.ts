import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { AUDIENCE, SLIDES } from '../content';

/** Headline on the left, the ERP as each kind of user sees it on the right. Slides advance every 5.5 s unless the visitor is looking. */
@Component({
  selector: 'rcx-hero',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section id="top" class="border-b border-black/5" aria-label="Red Codex">
      <div class="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-28">
        <div class="min-w-0 lg:col-span-5">
          <span class="inline-flex items-center gap-2 text-sm font-medium text-slate-600"><span class="h-1.5 w-1.5 rounded-full bg-brand"></span>Software company · Dhaka, Bangladesh</span>
          <h1 class="mt-6 text-4xl font-semibold leading-[1.08] sm:text-5xl xl:text-6xl">One ERP, <span class="text-brand">a screen for everyone</span> in your company.</h1>
          <p class="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">Red CodeX ERP gives each person their own dashboard: the admin, the manager, the accountant, the employee, the client and the vendor. Money, projects, stock and people, all in one place.</p>
          <div class="mt-9 flex flex-wrap gap-3">
            <a href="#demo" class="btn btn-red !px-7">Request an ERP demo</a>
            <a href="#pricing" class="btn btn-line !px-7">See pricing</a>
          </div>
          <a href="#electro" class="mt-6 inline-flex text-sm font-medium text-slate-600 transition hover:text-brand">⚡ New: Electro AI. Ask anything, like ChatGPT, Claude or Gemini →</a>
          <dl class="mt-12 flex max-w-md gap-10 border-t border-black/5 pt-6">
            <div><dd class="text-2xl font-semibold">{{ slides.length }}</dd><dt class="text-xs text-slate-500">Dashboards</dt></div>
            <div><dd class="text-2xl font-semibold">14</dd><dt class="text-xs text-slate-500">ERP parts</dt></div>
            <div><dd class="text-2xl font-semibold" data-no-i18n>EN · বাং</dd><dt class="text-xs text-slate-500">Languages</dt></div>
          </dl>
        </div>

        <div class="min-w-0 lg:col-span-7" role="region" aria-roledescription="carousel" aria-label="Red CodeX ERP screens for every kind of user"
             (mouseenter)="paused.set(true)" (mouseleave)="paused.set(false)" (focusin)="paused.set(true)" (focusout)="paused.set(false)">
          <div class="relative">
            <div class="rounded-2xl bg-soft p-2 ring-1 ring-black/10">
              <div class="truncate px-2 pb-2 text-xs text-slate-500">Red CodeX ERP · {{ slide().role }}</div>
              <div class="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                @for (s of slides; track s.id; let i = $index) {
                  <img [src]="s.img" [alt]="s.role + ' dashboard'" class="absolute inset-0 h-full w-full object-cover object-top transition duration-700" [class]="i === idx() ? 'opacity-100' : 'opacity-0'" [attr.aria-hidden]="i !== idx()" [attr.loading]="i ? 'lazy' : 'eager'" draggable="false" />
                }
              </div>
            </div>
            <button type="button" class="absolute left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white ring-1 ring-black/10 transition hover:scale-105 sm:-left-5" aria-label="Previous screen" (click)="go(-1)"><lucide-icon [img]="Prev" [size]="18" /></button>
            <button type="button" class="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white ring-1 ring-black/10 transition hover:scale-105 sm:-right-5" aria-label="Next screen" (click)="go(1)"><lucide-icon [img]="Next" [size]="18" /></button>
          </div>
          <div class="mt-5 flex items-start gap-3" aria-live="polite">
            <span class="mt-0.5 flex-none rounded-full bg-brand px-2.5 py-0.5 text-xs font-medium text-white">{{ slide().role }}</span>
            <div><div class="font-semibold leading-tight">{{ slide().title }}</div><div class="mt-0.5 text-sm text-slate-600">{{ slide().text }}</div></div>
          </div>
          <div class="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Choose a user">
            @for (s of slides; track s.id; let i = $index) {
              <button type="button" role="tab" [attr.aria-selected]="i === idx()" class="flex-none rounded-full px-4 py-1.5 text-sm font-medium transition" [class]="i === idx() ? 'bg-brand text-white' : 'text-slate-600 ring-1 ring-black/10 hover:bg-soft'" (click)="idx.set(i)">{{ s.role }}</button>
            }
          </div>
          <div class="mt-4 flex gap-1.5" aria-hidden="true">
            @for (s of slides; track s.id; let i = $index) {
              <span class="h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200"><span class="block h-full rounded-full bg-brand" [class.fill]="i === idx() && !paused()" [style.width.%]="i < idx() || (i === idx() && paused()) ? 100 : 0"></span></span>
            }
          </div>
        </div>
      </div>
    </section>

    <div class="overflow-hidden border-b border-black/5 py-4" aria-hidden="true">
      <div class="marquee flex w-max gap-3 whitespace-nowrap text-sm text-slate-500">@for (c of strip; track $index) { <span class="rounded-full px-4 py-1 ring-1 ring-black/10">{{ c }}</span> }</div>
    </div>
  `,
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly slides = SLIDES; readonly strip = [...AUDIENCE, ...AUDIENCE]; readonly Prev = ChevronLeft; readonly Next = ChevronRight;
  idx = signal(0); paused = signal(false);
  slide = computed(() => this.slides[this.idx()]);
  private timer?: ReturnType<typeof setInterval>;
  ngOnInit(): void { this.timer = setInterval(() => { if (!this.paused() && !document.hidden) { this.go(1); } }, 5500); }
  ngOnDestroy(): void { clearInterval(this.timer); }
  go(d: number): void { this.idx.set((this.idx() + d + this.slides.length) % this.slides.length); }
}
