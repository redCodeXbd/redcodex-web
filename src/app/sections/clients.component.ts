import { Component, computed, inject } from '@angular/core';
import { SiteService } from '../site.service';

/** Client logos, managed in the ERP's Platform panel (Website). The row scrolls when there are enough to fill it; hidden when there are none. */
@Component({
  selector: 'rcx-clients',
  standalone: true,
  template: `
    @if (clients().length) {
      <section id="clients" class="py-16" aria-label="Our clients">
        <div class="wrap text-center"><p class="text-sm text-slate-500"><span class="font-medium text-ink">{{ site.content().clientsTitle }}.</span> {{ site.content().clientsText }}</p></div>
        <div class="marquee-mask mt-8 overflow-hidden" role="list" aria-label="Client logos">
          <div class="flex w-max items-center gap-14 hover:[animation-play-state:paused]" [class.marquee]="loop().length > clients().length" [class.mx-auto]="loop().length === clients().length">
            @for (c of loop(); track $index) {
              <div role="listitem" class="flex h-12 w-32 flex-none items-center justify-center grayscale transition hover:grayscale-0" [attr.aria-hidden]="$index >= clients().length || null">
                @if (c.url) { <a [href]="c.url" target="_blank" rel="noopener" [attr.tabindex]="$index >= clients().length ? -1 : null"><img [src]="c.logo" [alt]="c.name" class="max-h-12 max-w-full object-contain opacity-70 transition hover:opacity-100" loading="lazy" /></a> }
                @else { <img [src]="c.logo" [alt]="c.name" class="max-h-12 max-w-full object-contain opacity-70" loading="lazy" /> }
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class ClientsComponent {
  readonly site = inject(SiteService);
  clients = computed(() => this.site.content().clients);
  /** Repeated to fill a wide screen, then doubled so the scroll loops without a gap. Few logos sit still in the middle. */
  loop = computed(() => { const l = this.clients(); if (l.length < 6) { return l; } const once = Array.from({ length: Math.ceil(10 / l.length) }, () => l).flat(); return [...once, ...once]; });
}
