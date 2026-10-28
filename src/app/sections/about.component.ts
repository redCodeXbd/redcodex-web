import { Component } from '@angular/core';
import { ArrowRight, LucideAngularModule } from 'lucide-angular';
import { ABOUT_FACTS, ABOUT_VALUES } from '../content';
import { RevealDirective } from '../reveal.directive';

/** Who Red Codex is: a short statement, three working principles, and four facts. */
@Component({
  selector: 'rcx-about',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="about" class="section" aria-label="About Red Codex">
      <div class="wrap">
        <div class="grid gap-14 lg:grid-cols-12">
          <div rv class="lg:col-span-5">
            <span class="eyebrow">About us</span>
            <h2 class="h2">A company that stays close to the work.</h2>
          </div>
          <div rv [rv]="1" class="lg:col-span-6 lg:col-start-7">
            <p class="text-xl leading-relaxed text-ink">Red Codex is a software company in Dhaka. We make ready-to-use software and design custom software for businesses.</p>
            <p class="mt-5 leading-relaxed text-slate-500">Red CodeX ERP began at Encore Engineering Limited, our sister concern, so it was shaped by real projects, payroll and stock from the first day. Every product we make is built with the people who use it every day.</p>
            <a href="#demo" class="link mt-7">Work with us<lucide-icon [img]="Arrow" [size]="15" class="arrow" /></a>
          </div>
        </div>

        <ol class="mt-20 grid gap-10 border-t border-black/[0.07] pt-10 md:grid-cols-3 md:gap-8">
          @for (v of values; track v.t; let i = $index) {
            <li rv [rv]="i">
              <span class="text-sm font-medium tabular-nums text-brand" data-no-i18n>0{{ i + 1 }}</span>
              <h3 class="mt-3 text-lg font-medium">{{ v.t }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ v.d }}</p>
            </li>
          }
        </ol>

        <dl class="mt-16 grid gap-px overflow-hidden rounded-3xl bg-black/[0.07] ring-1 ring-black/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          @for (f of facts; track f.t; let i = $index) {
            <div rv [rv]="i" class="bg-soft p-7">
              <lucide-icon [img]="f.i" [size]="20" class="text-brand" />
              <dt class="mt-5 font-medium">{{ f.t }}</dt>
              <dd class="mt-1 text-sm text-slate-500">{{ f.d }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
})
export class AboutComponent { readonly values = ABOUT_VALUES; readonly facts = ABOUT_FACTS; readonly Arrow = ArrowRight; }
