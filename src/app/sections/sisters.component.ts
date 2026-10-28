import { Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';
import { SISTERS } from '../content';

@Component({
  selector: 'rcx-sisters',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="sisters" class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-32" aria-label="Sister concerns">
      <div rv class="mx-auto max-w-2xl text-center"><span class="eyebrow">Sister concerns</span><h2 class="mt-3 text-3xl font-semibold sm:text-4xl">The family behind Red Codex</h2></div>
      <div class="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        @for (s of sisters; track s.name) {
          <article rv class="card flex flex-col p-7 transition hover:-translate-y-0.5 hover:ring-brand/40">
            <div class="flex h-20 items-center"><img [src]="s.logo" [alt]="s.name" class="max-h-full max-w-[10rem] object-contain" loading="lazy" /></div>
            <h3 class="mt-4 text-xl font-semibold">{{ s.name }}</h3>
            <p class="text-sm font-medium text-brand">{{ s.tagline }}</p>
            <p class="mt-3 text-sm text-slate-600">{{ s.blurb }}</p>
            <a [href]="s.url" [attr.target]="s.url.startsWith('http') ? '_blank' : null" rel="noopener" class="btn btn-line mt-auto">{{ s.cta }}</a>
          </article>
        }
      </div>
    </section>
  `,
})
export class SistersComponent { readonly sisters = SISTERS; }
