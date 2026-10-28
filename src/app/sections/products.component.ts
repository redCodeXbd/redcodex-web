import { Component } from '@angular/core';
import { Check } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { PRODUCTS } from '../content';

@Component({
  selector: 'rcx-products',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="products" class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-32" aria-label="Our software">
      <div rv class="mx-auto max-w-2xl text-center">
        <span class="eyebrow">Our software</span>
        <h2 class="mt-3 text-3xl font-semibold sm:text-4xl">Ready to use, and supported by the people who built it.</h2>
      </div>
      <div class="mt-14 grid gap-6 lg:grid-cols-3">
        @for (p of products; track p.name) {
          <article rv class="flex flex-col rounded-2xl p-7" [class]="p.flagship ? 'bg-ink text-white' : 'bg-white ring-1 ring-black/10'">
            @if (p.flagship) { <span class="mb-5 w-fit rounded-full bg-brand px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">Flagship</span> }
            <h3 class="text-2xl font-semibold">{{ p.name }}</h3>
            <p class="mt-1 text-sm font-medium text-brand" [class.!text-red-300]="p.flagship">{{ p.host }}</p>
            <p class="mt-4" [class]="p.flagship ? 'text-white/80' : 'text-slate-600'">{{ p.blurb }}</p>
            <ul class="mt-5 space-y-2 text-sm">
              @for (f of p.points; track f) { <li class="flex gap-2"><lucide-icon [img]="Check" [size]="16" class="mt-0.5 flex-none text-brand" />{{ f }}</li> }
            </ul>
            <div class="mt-auto pt-8">
              <a [href]="p.href" [attr.target]="p.href.startsWith('http') ? '_blank' : null" rel="noopener" class="btn w-full" [class]="p.flagship ? 'btn-red' : 'btn-line'">{{ p.cta }}</a>
            </div>
          </article>
        }
      </div>
      <div rv class="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-soft p-6 sm:flex-row sm:p-8">
        <div><h3 class="text-lg font-semibold">And many more</h3><p class="text-sm text-slate-600">We have built software for many kinds of business. Tell us what you do and we will show you what fits, or design it for you.</p></div>
        <a href="#demo" class="btn btn-red">Tell us what you need</a>
      </div>
    </section>
  `,
})
export class ProductsComponent { readonly products = PRODUCTS; readonly Check = Check; }
