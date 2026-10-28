import { Component } from '@angular/core';
import { ArrowRight, ArrowUpRight, Check, LucideAngularModule } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { PRODUCTS } from '../content';

/** A bento: the flagship ERP large on the left, the two other products stacked on the right. */
@Component({
  selector: 'rcx-products',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="products" class="section" aria-label="Our software">
      <div class="wrap">
        <div rv class="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div><span class="eyebrow">Our software</span><h2 class="h2">Ready to use, and supported by the people who built it.</h2></div>
          <p class="max-w-md text-slate-500 lg:justify-self-end">We have built software for many kinds of business. These are the ones people ask for most.</p>
        </div>

        <div class="mt-14 grid gap-4 lg:grid-cols-12">
          <article rv class="group relative flex flex-col overflow-hidden rounded-3xl bg-soft p-8 hairline lg:col-span-7 lg:row-span-2 lg:p-10">
            <span class="w-fit rounded-full bg-white px-2.5 py-1 text-xs font-medium text-brand ring-1 ring-inset ring-brand/20">Flagship</span>
            <h3 class="mt-6 text-3xl font-semibold">{{ erp.name }}</h3>
            <p class="mt-2 text-sm text-slate-500">{{ erp.host }}</p>
            <p class="mt-5 max-w-md text-slate-600">{{ erp.blurb }}</p>
            <ul class="mt-6 grid gap-2.5 text-sm sm:grid-cols-2">
              @for (f of erp.points; track f) { <li class="flex gap-2"><lucide-icon [img]="Check" [size]="16" class="mt-0.5 flex-none text-brand" />{{ f }}</li> }
            </ul>
            <div class="mt-8 flex flex-wrap gap-3"><a href="#erp" class="btn btn-red">Explore the ERP<lucide-icon [img]="Arrow" [size]="16" class="arrow" /></a><a href="#pricing" class="btn btn-line bg-white">See pricing</a></div>
            <div class="-mb-10 mt-10 overflow-hidden rounded-t-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.06] transition duration-500 group-hover:-translate-y-1 lg:-mb-10" aria-hidden="true">
              <img src="images/erp/dash-admin.jpg" alt="" class="block h-48 w-full object-cover object-top sm:h-56" loading="lazy" />
            </div>
          </article>

          @for (p of others; track p.name; let i = $index) {
            <a rv [rv]="i + 1" [href]="p.href" target="_blank" rel="noopener" class="group flex flex-col rounded-3xl p-8 hairline transition duration-300 hover:-translate-y-0.5 hover:ring-black/[0.14] lg:col-span-5">
              <div class="flex items-start justify-between gap-4">
                <div><h3 class="text-xl font-semibold">{{ p.name }}</h3><p class="mt-1 text-sm text-slate-500">{{ p.host }}</p></div>
                <span class="flex h-9 w-9 flex-none items-center justify-center rounded-full ring-1 ring-inset ring-black/10 transition group-hover:bg-brand group-hover:text-white group-hover:ring-brand"><lucide-icon [img]="Out" [size]="16" /></span>
              </div>
              <p class="mt-4 text-sm text-slate-600">{{ p.blurb }}</p>
              <ul class="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">@for (f of p.points; track f) { <li class="rounded-full bg-soft px-2.5 py-1">{{ f }}</li> }</ul>
            </a>
          }
        </div>

        <div rv class="mt-10 flex flex-col items-start justify-between gap-4 border-t border-black/[0.06] pt-8 sm:flex-row sm:items-center">
          <p class="text-slate-600"><span class="font-medium text-ink">And many more.</span> Tell us what you do and we will show you what fits, or design it for you.</p>
          <a href="#demo" class="link flex-none">Tell us what you need<lucide-icon [img]="Arrow" [size]="15" class="arrow" /></a>
        </div>
      </div>
    </section>
  `,
})
export class ProductsComponent {
  readonly erp = PRODUCTS[0]; readonly others = PRODUCTS.slice(1);
  readonly Check = Check; readonly Arrow = ArrowRight; readonly Out = ArrowUpRight;
}
