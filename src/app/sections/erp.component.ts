import { Component } from '@angular/core';
import { Check, LucideAngularModule } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { ERP_FEATURES, PERKS, ROLES } from '../content';

@Component({
  selector: 'rcx-erp',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="erp" class="bg-soft py-20 lg:py-32" aria-label="Red CodeX ERP">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div rv class="mx-auto max-w-3xl text-center">
          <span class="eyebrow">Flagship product</span>
          <h2 class="mt-3 text-3xl font-semibold sm:text-4xl">Red CodeX ERP</h2>
          <p class="mt-4 text-lg text-slate-600">Money in, money out and who decided, all in one place. Every part works with the others, so nobody types the same thing twice.</p>
        </div>
        <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          @for (f of features; track f.t) {
            <div rv class="card p-6 transition hover:-translate-y-0.5 hover:ring-brand/40">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white"><lucide-icon [img]="f.i" [size]="20" /></span>
              <h3 class="mt-4 font-semibold">{{ f.t }}</h3>
              <p class="mt-1.5 text-sm text-slate-600">{{ f.d }}</p>
            </div>
          }
        </div>
        <div rv class="mt-12 grid items-center gap-8 rounded-2xl bg-ink p-8 text-white lg:grid-cols-2 lg:p-12">
          <div>
            <h3 class="text-2xl font-semibold sm:text-3xl">A page for every kind of person</h3>
            <p class="mt-3 text-white/70">Admin, manager, accountant, data entry, employee, client and vendor each sign in to their own dashboard.</p>
            <div class="mt-5 flex flex-wrap gap-2">@for (r of roles; track r) { <span class="rounded-full px-3 py-1 text-sm ring-1 ring-white/20">{{ r }}</span> }</div>
          </div>
          <ul class="grid gap-3 sm:grid-cols-2">
            @for (p of perks; track p) { <li class="flex gap-3 rounded-xl p-4 text-sm ring-1 ring-white/10"><lucide-icon [img]="Check" [size]="16" class="mt-0.5 flex-none text-red-400" />{{ p }}</li> }
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class ErpComponent { readonly features = ERP_FEATURES; readonly roles = ROLES; readonly perks = PERKS; readonly Check = Check; }
