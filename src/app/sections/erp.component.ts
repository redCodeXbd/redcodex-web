import { Component } from '@angular/core';
import { Check, LucideAngularModule } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { ERP_FEATURES, PERKS, ROLES, SLIDES } from '../content';

/** The ERP's parts as a ruled grid, then the "a page for every person" story with the role screens. */
@Component({
  selector: 'rcx-erp',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="erp" class="section bg-soft" aria-label="Red CodeX ERP">
      <div class="wrap">
        <div rv class="max-w-2xl">
          <span class="eyebrow">Red CodeX ERP</span>
          <h2 class="h2">Everything the company runs on, in one place.</h2>
          <p class="lead">Money in, money out and who decided, all in one place. Every part works with the others, so nobody types the same thing twice.</p>
        </div>

        <div class="mt-14 grid gap-px overflow-hidden rounded-3xl bg-black/[0.07] ring-1 ring-black/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          @for (f of features; track f.t; let i = $index) {
            <div rv [rv]="i % 4" class="group bg-white p-7 transition-colors duration-300 hover:bg-[#fffafa]">
              <lucide-icon [img]="f.i" [size]="20" class="text-slate-400 transition-colors duration-300 group-hover:text-brand" />
              <h3 class="mt-6 font-medium">{{ f.t }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ f.d }}</p>
            </div>
          }
        </div>

        <div class="mt-24 grid items-center gap-14 lg:grid-cols-2">
          <div rv>
            <h3 class="text-2xl font-semibold sm:text-3xl">A page for every kind of person</h3>
            <p class="mt-4 max-w-md text-slate-500">Admin, manager, accountant, data entry, employee, client and vendor each sign in to their own dashboard.</p>
            <ul class="mt-8 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              @for (p of perks; track p) { <li class="flex gap-2.5"><lucide-icon [img]="Check" [size]="16" class="mt-0.5 flex-none text-brand" />{{ p }}</li> }
            </ul>
          </div>
          <div rv [rv]="1" class="relative h-72 sm:h-80" aria-hidden="true">
            @for (s of stack; track s.id; let i = $index) {
              <img [src]="s.img" alt="" loading="lazy" class="absolute w-[78%] rounded-xl object-cover object-top shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06] transition duration-500 hover:z-10 hover:-translate-y-2"
                   [style.left.%]="i * 11" [style.top.px]="i * 26" [style.z-index]="i" [style.aspect-ratio]="'16/10'" />
            }
          </div>
        </div>
        <div rv class="mt-10 flex flex-wrap gap-2">@for (r of roles; track r) { <span class="rounded-full bg-white px-3 py-1 text-xs text-slate-600 hairline">{{ r }}</span> }</div>
      </div>
    </section>
  `,
})
export class ErpComponent {
  readonly features = ERP_FEATURES; readonly roles = ROLES; readonly perks = PERKS; readonly Check = Check;
  readonly stack = [SLIDES[4], SLIDES[2], SLIDES[0]];
}
