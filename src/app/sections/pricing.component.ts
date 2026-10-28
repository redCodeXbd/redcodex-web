import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService, Plan } from '../api.service';
import { RevealDirective } from '../reveal.directive';
import { Check, LucideAngularModule } from 'lucide-angular';

/** Plans come live from the backend, so a price changed in the Platform panel shows here. Hidden if they cannot be loaded. */
@Component({
  selector: 'rcx-pricing',
  standalone: true,
  imports: [RevealDirective, LucideAngularModule],
  template: `
    @if (plans().length) {
      <section id="pricing" class="bg-soft py-20 lg:py-32" aria-label="Red CodeX ERP pricing">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div rv class="mx-auto max-w-2xl text-center">
            <span class="eyebrow">Pricing</span>
            <h2 class="mt-3 text-3xl font-semibold sm:text-4xl">Simple plans that grow with you</h2>
            <div class="mt-6 inline-flex rounded-full bg-white p-1 ring-1 ring-black/10" role="group" aria-label="Billing">
              <button type="button" class="rounded-full px-5 py-2 text-sm font-medium transition" [class]="!yearly() ? 'bg-ink text-white' : 'text-slate-600'" (click)="yearly.set(false)">Monthly</button>
              <button type="button" class="rounded-full px-5 py-2 text-sm font-medium transition" [class]="yearly() ? 'bg-ink text-white' : 'text-slate-600'" (click)="yearly.set(true)">Yearly</button>
            </div>
          </div>
          <div class="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            @for (p of plans(); track p.id; let i = $index) {
              <article rv class="flex flex-col rounded-2xl bg-white p-6" [class]="p.key === 'business' ? 'ring-2 ring-brand' : 'ring-1 ring-black/10'">
                <div class="flex items-center justify-between"><h3 class="text-xl font-semibold">{{ p.name }}</h3>@if (p.key === 'business') { <span class="rounded-full bg-brand px-2.5 py-0.5 text-xs font-medium text-white">Most chosen</span> }</div>
                <p class="mt-2 min-h-[3.5rem] text-sm text-slate-600">{{ p.description }}</p>
                <div class="mt-4"><span class="text-3xl font-semibold">BDT {{ (yearly() ? p.priceYearly : p.priceMonthly).toLocaleString('en-US') }}</span><span class="text-sm text-slate-500"> / {{ yearly() ? 'year' : 'month' }}</span></div>
                <ul class="mt-5 space-y-2 border-t border-black/5 pt-5 text-sm">
                  <li class="flex gap-2"><lucide-icon [img]="Check" [size]="16" class="mt-0.5 flex-none text-brand" />{{ p.modules.length }} modules included</li>
                </ul>
                <div class="mt-auto pt-6"><a href="#demo" class="btn w-full" [class]="p.key === 'business' ? 'btn-red' : 'btn-line'">Request a demo</a></div>
              </article>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class PricingComponent implements OnInit {
  private api = inject(ApiService);
  readonly Check = Check;
  plans = signal<Plan[]>([]); yearly = signal(false);
  ngOnInit(): void { this.api.plans().then((p) => this.plans.set(p), () => this.plans.set([])); }
}
