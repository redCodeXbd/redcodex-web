import { Component } from '@angular/core';
import { Check, LucideAngularModule } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { SERVICES, STEPS } from '../content';

/** The one dark band on the page. */
@Component({
  selector: 'rcx-custom',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="custom" class="bg-ink py-20 text-white lg:py-32" aria-label="Custom software">
      <div class="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div rv>
          <span class="text-xs font-medium uppercase tracking-[0.14em] text-red-400">Custom software</span>
          <h2 class="mt-3 text-3xl font-semibold sm:text-4xl">Nothing off the shelf fits? We design it for you.</h2>
          <p class="mt-4 text-lg text-white/70">We build software around the way your business really works, from a booking system to a full internal platform. A team that listens, builds in small steps and stays after launch.</p>
          <ul class="mt-6 grid gap-3 sm:grid-cols-2">
            @for (s of services; track s) { <li class="flex gap-3 rounded-xl p-4 text-sm ring-1 ring-white/10"><lucide-icon [img]="Check" [size]="16" class="mt-0.5 flex-none text-red-400" />{{ s }}</li> }
          </ul>
          <a href="#demo" class="btn btn-red mt-8">Discuss your idea</a>
        </div>
        <ol class="space-y-4" aria-label="How we work">
          @for (s of steps; track s.t; let i = $index) {
            <li rv class="flex gap-4 rounded-xl p-5 ring-1 ring-white/10">
              <span class="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand font-semibold">{{ i + 1 }}</span>
              <span><b class="block text-lg font-semibold">{{ s.t }}</b><span class="text-sm text-white/70">{{ s.d }}</span></span>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class CustomComponent { readonly services = SERVICES; readonly steps = STEPS; readonly Check = Check; }
