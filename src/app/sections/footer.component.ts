import { Component } from '@angular/core';
import { appUrl } from '../config';
import { inject } from '@angular/core';
import { MENU } from '../content';
import { MarketingService } from '../marketing/marketing.service';
import { SiteService } from '../site.service';

@Component({
  selector: 'rcx-footer',
  standalone: true,
  template: `
    <footer class="border-t border-black/[0.06]">
      <div class="wrap grid gap-12 py-16 md:grid-cols-12">
        <div class="md:col-span-5">
          <img [src]="site.brandLogo" alt="Red Codex" class="h-8 w-auto" />
          <p class="mt-5 max-w-xs text-sm leading-relaxed text-slate-500">Red Codex is a software company in Dhaka. We make ready-to-use software and design custom software for businesses.</p>
        </div>
        @for (g of menu; track g.label) {
          <div class="md:col-span-2"><h4 class="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{{ g.label }}</h4>
            <ul class="mt-4 space-y-2.5 text-sm text-slate-600">@for (i of g.items; track i.label) { <li><a [href]="i.href" [attr.target]="i.href.startsWith('http') ? '_blank' : null" rel="noopener" class="transition hover:text-ink">{{ i.label }}</a></li> }</ul>
          </div>
        }
        <div class="md:col-span-3"><h4 class="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Contact</h4>
          <ul class="mt-4 space-y-2.5 text-sm text-slate-600"><li><a [href]="siteSvc.tel()" class="transition hover:text-ink">{{ site.phone }}</a></li><li><a [href]="'mailto:' + site.email" class="transition hover:text-ink">{{ site.email }}</a></li><li class="leading-relaxed">{{ site.address }}</li></ul>
        </div>
      </div>
      <div class="wrap flex flex-col items-center justify-between gap-3 border-t border-black/[0.06] py-6 text-xs text-slate-400 sm:flex-row">
        <span>© {{ year }} Red Codex. All rights reserved.</span>
        <!-- <span class="flex gap-5">@if (mk.anyActive()) { <button type="button" class="transition hover:text-ink" (click)="mk.reopen.set(true)">Cookie settings</button> }<a [href]="app" data-sign-in class="transition hover:text-ink">Sign in to Red CodeX ERP</a></span> -->
      </div>
    </footer>
    <a [href]="'https://wa.me/' + site.whatsapp" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" class="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] transition hover:scale-105">
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>
    </a>
  `,
})
export class FooterComponent {
  readonly siteSvc = inject(SiteService); readonly mk = inject(MarketingService);
  get site() { return this.siteSvc.content(); }
  readonly menu = MENU; readonly app = appUrl(); readonly year = new Date().getFullYear();
}
