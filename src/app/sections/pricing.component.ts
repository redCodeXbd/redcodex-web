import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ArrowRight, Check, LucideAngularModule } from 'lucide-angular';
import { ApiService, Plan } from '../api.service';
import { MODULE_LABELS } from '../content';
import { RevealDirective } from '../reveal.directive';
import { FALLBACK_PLANS } from '../plans.fallback';

/** Plans come live from the backend (publicPlans), so a price changed in the Platform panel shows here. Until they arrive, or if the backend cannot be reached, the last known plans are shown. */
@Component({
  selector: 'rcx-pricing',
  standalone: true,
  imports: [RevealDirective, LucideAngularModule],
  template: `
    @if (plans().length) {
      <section id="pricing" class="section bg-soft" aria-label="Red CodeX ERP pricing">
        <div class="wrap">
          <div rv class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-xl"><span class="eyebrow">Pricing</span><h2 class="h2">Simple plans that grow with you</h2><p class="lead">Every plan includes setup help, English and Bangla, and updates.</p></div>
            <div class="flex items-center gap-3">
              <div class="relative inline-flex rounded-full bg-white p-1 hairline" role="group" aria-label="Billing">
                <span class="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-300 ease-out" [class.translate-x-full]="yearly()" aria-hidden="true"></span>
                <button type="button" class="relative z-10 w-24 rounded-full py-2 text-sm font-medium transition-colors" [class]="!yearly() ? 'text-white' : 'text-slate-500'" [attr.aria-pressed]="!yearly()" (click)="yearly.set(false)">Monthly</button>
                <button type="button" class="relative z-10 w-24 rounded-full py-2 text-sm font-medium transition-colors" [class]="yearly() ? 'text-white' : 'text-slate-500'" [attr.aria-pressed]="yearly()" (click)="yearly.set(true)">Yearly</button>
              </div>
              @if (bestSaving()) { <span class="text-xs font-medium text-brand">Save up to {{ bestSaving() }}%</span> }
            </div>
          </div>

          <div class="mt-14 grid gap-4 sm:grid-cols-2" [class]="plans().length >= 4 ? 'xl:grid-cols-4' : 'lg:grid-cols-3'">
            @for (p of plans(); track p.id; let i = $index) {
              <article rv [rv]="i" class="relative flex flex-col rounded-3xl bg-white p-7 transition duration-300" [class]="p.key === 'business' ? 'ring-2 ring-brand shadow-[0_24px_60px_-30px_rgba(200,16,46,0.45)]' : 'hairline hover:ring-black/[0.14]'">
                <div class="flex items-center justify-between gap-2"><h3 class="font-semibold">{{ p.name }}</h3>@if (p.key === 'business') { <span class="rounded-full bg-brand px-2.5 py-0.5 text-xs font-medium text-white">Most chosen</span> }</div>
                <p class="mt-2 line-clamp-3 min-h-[3.75rem] text-sm text-slate-500">{{ p.description }}</p>
                <div class="mt-6 flex items-baseline gap-1 whitespace-nowrap">
                  <span class="text-sm text-slate-500">BDT</span><span class="text-[2rem] font-semibold tabular-nums tracking-tight">{{ price(p).toLocaleString('en-US') }}</span><span class="text-sm text-slate-500">/ {{ yearly() ? 'year' : 'month' }}</span>
                </div>
                <p class="mt-1 h-4 text-xs text-slate-400">@if (yearly() && saving(p)) { You save {{ saving(p) }}% }</p>
                <a href="#demo" [attr.data-plan]="p.name" class="btn mt-6 w-full" [class]="p.key === 'business' ? 'btn-red' : 'btn-line'">Request a demo</a>
                <ul class="mt-7 space-y-2.5 border-t border-black/[0.06] pt-6 text-sm text-slate-600">
                  @for (m of shown(p); track m) { <li class="flex gap-2.5"><lucide-icon [img]="Check" [size]="15" class="mt-0.5 flex-none text-brand" />{{ m }}</li> }
                  @if (p.modules.length > 6) { <li class="pl-6 text-slate-400">and {{ p.modules.length - 6 }} more</li> }
                </ul>
              </article>
            }
          </div>
          <p rv class="mt-10 text-sm text-slate-500">Need something in between? <a href="#demo" class="link">Talk to us<lucide-icon [img]="Arrow" [size]="14" class="arrow" /></a></p>
        </div>
      </section>
    }
  `,
})
export class PricingComponent implements OnInit {
  private api = inject(ApiService);
  readonly Check = Check; readonly Arrow = ArrowRight;
  plans = signal<Plan[]>(FALLBACK_PLANS); yearly = signal(false);
  price = (p: Plan): number => (this.yearly() ? p.priceYearly : p.priceMonthly);
  /** What yearly billing saves over twelve months, in percent. */
  saving = (p: Plan): number => { const full = p.priceMonthly * 12; return full > 0 && p.priceYearly < full ? Math.round((1 - p.priceYearly / full) * 100) : 0; };
  bestSaving = computed(() => Math.max(0, ...this.plans().map(this.saving)));
  shown = (p: Plan): string[] => p.modules.slice(0, 6).map((m) => MODULE_LABELS[m] ?? m);
  ngOnInit(): void { this.api.plans().then((p) => { if (p.length) { this.plans.set(p); } }, () => { /* keep the last known plans */ }); }
}
