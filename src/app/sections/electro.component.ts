import { Component } from '@angular/core';
import { LucideAngularModule, Zap } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { AI_POINTS, CHAT } from '../content';

@Component({
  selector: 'rcx-electro',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="electro" class="py-20 lg:py-32" aria-label="Electro, the AI assistant">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div rv>
          <span class="eyebrow">New · AI assistant</span>
          <h2 class="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">Meet Electro. Ask anything. Get the work done.</h2>
          <p class="mt-5 text-lg text-slate-600">Electro is the AI assistant built into Red CodeX ERP. It looks in your own data, does the work and shows you what it did. Or just chat about anything. Type or speak, in English or Bangla.</p>
          <ul class="mt-8 grid gap-3 sm:grid-cols-2">
            @for (a of points; track a.t) {
              <li class="flex gap-3 rounded-xl p-4 ring-1 ring-black/10">
                <span class="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand"><lucide-icon [img]="a.i" [size]="18" /></span>
                <span><span class="block text-sm font-semibold">{{ a.t }}</span><span class="text-sm text-slate-600">{{ a.d }}</span></span>
              </li>
            }
          </ul>
          <div class="mt-8 flex flex-wrap gap-3"><a href="#demo" class="btn btn-red">See Electro in a demo</a><a href="#pricing" class="btn btn-line">See plans</a></div>
        </div>
        <div rv class="overflow-hidden rounded-2xl bg-soft ring-1 ring-black/10" role="img" aria-label="A chat with Electro: attendance for today, a purchase, and a general question answered">
          <div class="flex items-center gap-3 bg-brand px-4 py-3.5 text-white">
            <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20"><lucide-icon [img]="Zap" [size]="18" /></span>
            <div><div class="font-semibold leading-tight">Electro</div><div class="text-xs opacity-80">AI assistant · online</div></div>
          </div>
          <div class="flex min-h-[22rem] flex-col gap-2.5 p-4">
            @for (m of chat; track $index) {
              <div class="max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug" [class]="m.me ? 'self-end rounded-tr-sm bg-brand text-white' : 'self-start rounded-tl-sm bg-white ring-1 ring-black/10'">{{ m.text }}</div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ElectroComponent { readonly points = AI_POINTS; readonly chat = CHAT; readonly Zap = Zap; }
