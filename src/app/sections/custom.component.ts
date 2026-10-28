import { Component } from '@angular/core';
import { ArrowRight, LucideAngularModule } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { SERVICES, STEPS } from '../content';

/** The one dark band on the page: custom software, then how we work as a four-step timeline. */
@Component({
  selector: 'rcx-custom',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="custom" class="section relative overflow-hidden bg-ink text-white" aria-label="Custom software">
      <div class="pointer-events-none absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-brand/20 blur-3xl" aria-hidden="true"></div>
      <div class="wrap relative">
        <div class="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div rv>
            <span class="eyebrow !text-white/50">Custom software</span>
            <h2 class="h2">Nothing off the shelf fits? We design it for you.</h2>
          </div>
          <div rv [rv]="1">
            <p class="text-lg leading-relaxed text-white/60">We build software around the way your business really works, from a booking system to a full internal platform. A team that listens, builds in small steps and stays after launch.</p>
            <a href="#demo" class="btn btn-red mt-8">Discuss your idea<lucide-icon [img]="Arrow" [size]="16" class="arrow" /></a>
          </div>
        </div>

        <ol class="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" aria-label="How we work">
          @for (s of steps; track s.t; let i = $index) {
            <li rv [rv]="i" class="relative border-t border-white/15 pt-6">
              <span class="absolute -top-px left-0 h-px w-12 bg-brand" aria-hidden="true"></span>
              <span class="text-xs font-medium tabular-nums text-white/40" data-no-i18n>0{{ i + 1 }}</span>
              <h3 class="mt-3 text-lg font-medium">{{ s.t }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-white/55">{{ s.d }}</p>
            </li>
          }
        </ol>

        <div class="mt-24">
          <p rv class="text-xs font-medium uppercase tracking-[0.16em] text-white/40">What we build</p>
          <ul class="mt-6 grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-3">
            @for (s of services; track s.t; let i = $index) {
              <li rv [rv]="i % 3" class="group bg-ink p-7 transition-colors duration-300 hover:bg-[#18181b]">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-white/60 ring-1 ring-inset ring-white/10 transition duration-300 group-hover:bg-brand group-hover:text-white group-hover:ring-brand">
                  <lucide-icon [img]="s.i" [size]="18" />
                </span>
                <h3 class="mt-5 font-medium">{{ s.t }}</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-white/50">{{ s.d }}</p>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class CustomComponent { readonly services = SERVICES; readonly steps = STEPS; readonly Arrow = ArrowRight; }
