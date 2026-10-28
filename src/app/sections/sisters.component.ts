import { Component, inject } from '@angular/core';
import { ArrowUpRight, LucideAngularModule } from 'lucide-angular';
import { RevealDirective } from '../reveal.directive';
import { SiteService } from '../site.service';

@Component({
  selector: 'rcx-sisters',
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="sisters" class="section" aria-label="Sister concerns">
      <div class="wrap">
        <div rv class="max-w-xl"><span class="eyebrow">Sister concerns</span><h2 class="h2">The family behind Red Codex</h2></div>
        <div class="mt-12 grid gap-4 md:grid-cols-2">
          @for (s of site.content().sisters; track s.id; let i = $index) {
            <a rv [rv]="i" [href]="link(s.url)" [attr.target]="s.url.startsWith('http') ? '_blank' : null" rel="noopener" class="group flex items-center gap-6 rounded-3xl p-6 hairline transition duration-300 hover:-translate-y-0.5 hover:ring-black/[0.14] sm:p-7">
              <span class="flex h-20 w-24 flex-none items-center justify-center rounded-2xl bg-soft p-3"><img [src]="s.logo" [alt]="s.name" class="max-h-full max-w-full object-contain" loading="lazy" /></span>
              <span class="min-w-0 flex-1">
                <span class="block font-semibold">{{ s.name }}</span>
                <span class="mt-0.5 block text-xs text-slate-400">{{ s.tagline }}</span>
                <span class="mt-2 block text-sm leading-relaxed text-slate-500">{{ s.blurb }}</span>
              </span>
              <lucide-icon [img]="Out" [size]="18" class="flex-none self-start text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class SistersComponent {
  readonly site = inject(SiteService); readonly Out = ArrowUpRight;
  /** The ERP app's old website called its contact section #contact; here it is #demo. */
  link = (url: string): string => (!url || url === '#contact' ? '#demo' : url);
}
