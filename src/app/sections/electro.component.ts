import { Component } from '@angular/core';
import { ArrowRight, ArrowUp, LucideAngularModule, Mic, Zap } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { AI_POINTS, CHAT } from '../content';

/** Electro: what it does on the left, a chat that plays in once it scrolls into view on the right. */
@Component({
  selector: 'rcx-electro',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="electro" class="section" aria-label="Electro, the AI assistant">
      <div class="wrap grid items-center gap-16 lg:grid-cols-2">
        <div rv>
          <span class="eyebrow">New · AI assistant</span>
          <h2 class="h2">Meet Electro. Ask anything. Get the work done.</h2>
          <p class="lead">Electro is the AI assistant built into Red CodeX ERP. It looks in your own data, does the work and shows you what it did. Or just chat about anything. Type or speak, in English or Bangla.</p>
          <dl class="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            @for (a of points; track a.t) {
              <div>
                <dt class="flex items-center gap-2.5 text-sm font-medium"><lucide-icon [img]="a.i" [size]="16" class="text-brand" />{{ a.t }}</dt>
                <dd class="mt-1.5 text-sm leading-relaxed text-slate-500">{{ a.d }}</dd>
              </div>
            }
          </dl>
          <div class="mt-10 flex flex-wrap gap-3"><a href="#demo" class="btn btn-red">See Electro in a demo<lucide-icon [img]="Arrow" [size]="16" class="arrow" /></a><a href="#pricing" class="btn btn-line">See plans</a></div>
        </div>

        <div rv [rv]="1" class="relative">
          <div class="pointer-events-none absolute -inset-8 rounded-[3rem] bg-brand/[0.05] blur-2xl" aria-hidden="true"></div>
          <div class="relative overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-30px_rgba(17,17,19,0.3)] ring-1 ring-black/[0.06]" role="img" aria-label="A chat with Electro: attendance for today, a purchase, and a general question answered">
            <div class="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
              <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white"><lucide-icon [img]="Zap" [size]="17" /></span>
              <div class="flex-1"><div class="text-sm font-medium leading-tight">Electro</div><div class="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><i class="h-1.5 w-1.5 rounded-full bg-emerald-500"></i>AI assistant · online</div></div>
            </div>
            <div class="flex min-h-[23rem] flex-col gap-2.5 bg-soft/60 p-5">
              @for (m of chat; track $index; let i = $index) {
                <div class="msg max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-snug" [style.animation-delay.ms]="300 + i * 650"
                     [class]="m.me ? 'self-end rounded-br-md bg-ink text-white' : 'self-start rounded-bl-md bg-white text-slate-700 ring-1 ring-black/[0.06]'">{{ m.text }}</div>
              }
            </div>
            <div class="flex items-center gap-2 border-t border-black/[0.06] px-4 py-3" aria-hidden="true">
              <span class="flex-1 truncate text-sm text-slate-400">Ask Electro anything…</span>
              <span class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400"><lucide-icon [img]="Mic" [size]="16" /></span>
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white"><lucide-icon [img]="Up" [size]="16" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ElectroComponent { readonly points = AI_POINTS; readonly chat = CHAT; readonly Zap = Zap; readonly Mic = Mic; readonly Up = ArrowUp; readonly Arrow = ArrowRight; }
