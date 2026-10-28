import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SiteService } from '../site.service';
import { ArrowRight, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { AUDIENCE, SLIDES } from '../content';

/** Headline on the left, the ERP as each kind of user sees it on the right. Slides advance every 5.5 s unless the visitor is looking or swiping. */
@Component({
  selector: 'rcx-hero',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section id="top" class="relative overflow-hidden" aria-label="Red Codex">
      <div class="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand/[0.06] blur-3xl" aria-hidden="true"></div>
      <div class="wrap relative grid items-center gap-16 pb-20 pt-14 lg:grid-cols-12 lg:pb-28 lg:pt-24">
        <div class="min-w-0 lg:col-span-5">
          <a href="#electro" class="group inline-flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-xs text-slate-600 ring-1 ring-inset ring-black/10 transition hover:ring-black/20">
            <span class="rounded-full bg-brand px-2 py-0.5 font-medium text-white">New</span>Electro AI, ask anything<lucide-icon [img]="Arrow" [size]="13" class="transition group-hover:translate-x-0.5" />
          </a>
          <h1 class="mt-7 text-[2.6rem] font-semibold leading-[1.04] sm:text-6xl">{{ c().heroLead }}<span class="text-brand">{{ c().heroHighlight }}</span>{{ c().heroTail }}</h1>
          <p class="mt-6 max-w-md text-lg leading-relaxed text-slate-500">{{ c().heroText }}</p>
          <div class="mt-9 flex flex-wrap items-center gap-3">
            <a href="#demo" class="btn btn-red">Request an ERP demo<lucide-icon [img]="Arrow" [size]="16" class="arrow" /></a>
            <a href="#pricing" class="btn btn-line">See pricing</a>
          </div>
          <dl class="mt-14 grid max-w-sm grid-cols-3 divide-x divide-black/[0.07]">
            <div class="pr-4"><dd class="text-2xl font-semibold">{{ slides.length }}</dd><dt class="mt-0.5 text-xs text-slate-500">Dashboards</dt></div>
            <div class="px-4"><dd class="text-2xl font-semibold">14</dd><dt class="mt-0.5 text-xs text-slate-500">ERP parts</dt></div>
            <div class="pl-4"><dd class="text-2xl font-semibold" data-no-i18n>EN · বাং</dd><dt class="mt-0.5 text-xs text-slate-500">Languages</dt></div>
          </dl>
          <p class="mt-8 text-xs text-slate-400">{{ c().heroBadge }}</p>
        </div>

        <div class="min-w-0 lg:col-span-7" role="region" aria-roledescription="carousel" aria-label="Red CodeX ERP screens for every kind of user"
             (mouseenter)="paused.set(true)" (mouseleave)="paused.set(false)" (focusin)="paused.set(true)" (focusout)="paused.set(false)"
             (pointerdown)="x0 = $event.clientX" (pointerup)="swipe($event.clientX)">
          <div class="group relative">
            <div class="rounded-[1.25rem] bg-white p-1.5 shadow-[0_30px_80px_-30px_rgba(17,17,19,0.35)] ring-1 ring-black/[0.06]">
              <div class="flex items-center gap-1.5 px-2.5 py-2" aria-hidden="true"><i class="h-2 w-2 rounded-full bg-black/10"></i><i class="h-2 w-2 rounded-full bg-black/10"></i><i class="h-2 w-2 rounded-full bg-black/10"></i></div>
              <div class="relative aspect-[16/10] overflow-hidden rounded-xl bg-soft">
                @for (s of slides; track s.id; let i = $index) {
                  <img [src]="site.screen(s.id)" [alt]="s.role + ' dashboard'" class="absolute inset-0 h-full w-full select-none object-cover object-top transition duration-700 ease-out" [class]="i === idx() ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.015]'" [attr.aria-hidden]="i !== idx()" [attr.loading]="i ? 'lazy' : 'eager'" draggable="false" />
                }
              </div>
            </div>
            <button type="button" class="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm ring-1 ring-black/10 backdrop-blur transition group-hover:opacity-100 focus:opacity-100" aria-label="Previous screen" (click)="go(-1)"><lucide-icon [img]="Prev" [size]="16" /></button>
            <button type="button" class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm ring-1 ring-black/10 backdrop-blur transition group-hover:opacity-100 focus:opacity-100" aria-label="Next screen" (click)="go(1)"><lucide-icon [img]="Next" [size]="16" /></button>
          </div>

          <div class="mt-6 flex items-baseline justify-between gap-4" aria-live="polite">
            <div class="min-w-0"><span class="font-medium">{{ slide().title }}</span><span class="text-slate-400"> · </span><span class="text-sm text-slate-500">{{ slide().text }}</span></div>
            <span class="flex-none text-xs tabular-nums text-slate-400" data-no-i18n>{{ idx() + 1 }} / {{ slides.length }}</span>
          </div>
          <div class="mt-4 flex gap-1 overflow-x-auto" role="tablist" aria-label="Choose a user">
            @for (s of slides; track s.id; let i = $index) {
              <button type="button" role="tab" [attr.aria-selected]="i === idx()" class="group/t flex-1 pt-2 text-left" (click)="idx.set(i)">
                <span class="block h-0.5 overflow-hidden rounded-full bg-black/[0.07]"><span class="block h-full bg-brand" [class.fill]="i === idx() && !paused()" [style.width.%]="i < idx() || (i === idx() && paused()) ? 100 : 0"></span></span>
                <span class="mt-2 block whitespace-nowrap pr-2 text-xs transition" [class]="i === idx() ? 'text-ink font-medium' : 'text-slate-400 group-hover/t:text-slate-600'">{{ s.role }}</span>
              </button>
            }
          </div>
        </div>
      </div>

      <div class="border-y border-black/[0.06] py-5">
        <div class="wrap flex items-center gap-8">
          <span class="hidden flex-none text-xs font-medium uppercase tracking-[0.16em] text-slate-400 sm:block">Built for</span>
          <div class="marquee-mask min-w-0 flex-1 overflow-hidden" aria-label="Who the software is for">
            <div class="marquee flex w-max gap-10 whitespace-nowrap text-sm text-slate-500">@for (c of strip; track $index) { <span [attr.aria-hidden]="$index >= strip.length / 2 || null">{{ c }}</span> }</div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly slides = SLIDES; readonly strip = [...AUDIENCE, ...AUDIENCE];
  readonly Prev = ChevronLeft; readonly Next = ChevronRight; readonly Arrow = ArrowRight;
  readonly site = inject(SiteService); c = this.site.content;
  idx = signal(0); paused = signal(false);
  slide = computed(() => this.slides[this.idx()]);
  x0 = 0;
  private timer?: ReturnType<typeof setInterval>;
  ngOnInit(): void { this.timer = setInterval(() => { if (!this.paused() && !document.hidden) { this.go(1); } }, 5500); }
  ngOnDestroy(): void { clearInterval(this.timer); }
  go(d: number): void { this.idx.set((this.idx() + d + this.slides.length) % this.slides.length); }
  swipe(x: number): void { const d = x - this.x0; if (Math.abs(d) > 40) { this.go(d < 0 ? 1 : -1); } }
}
