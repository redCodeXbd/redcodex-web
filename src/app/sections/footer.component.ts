import { Component } from '@angular/core';
import { appUrl } from '../config';
import { SITE } from '../content';

@Component({
  selector: 'rcx-footer',
  standalone: true,
  template: `
    <footer class="border-t border-black/5">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div class="md:col-span-2"><img src="images/redcodex/logo-wide.png" alt="Red Codex" class="h-9 w-auto" /><p class="mt-4 max-w-sm text-sm text-slate-600">Red Codex is a software company in Dhaka. We make ready-to-use software and design custom software for businesses.</p></div>
        <div><h4 class="text-sm font-semibold">Software</h4><ul class="mt-3 space-y-2 text-sm text-slate-600"><li><a href="#erp" class="hover:text-brand">Red CodeX ERP</a></li><li><a href="https://hrmx.redcodex.net" target="_blank" rel="noopener" class="hover:text-brand">HRMX</a></li><li><a href="https://aenrivercruise.com" target="_blank" rel="noopener" class="hover:text-brand">Aen River Cruise</a></li><li><a href="#custom" class="hover:text-brand">Custom software</a></li></ul></div>
        <div><h4 class="text-sm font-semibold">Contact</h4><ul class="mt-3 space-y-2 text-sm text-slate-600"><li><a [href]="'tel:' + tel" class="hover:text-brand">{{ site.phone }}</a></li><li><a [href]="'mailto:' + site.email" class="hover:text-brand">{{ site.email }}</a></li><li>{{ site.address }}</li></ul></div>
      </div>
      <div class="border-t border-black/5 py-5 text-center text-xs text-slate-500">© {{ year }} Red Codex. All rights reserved. · <a [href]="app" class="hover:text-brand">Sign in to Red CodeX ERP</a></div>
    </footer>
    <a [href]="'https://wa.me/' + site.whatsapp" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" class="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-xl text-white transition hover:bg-[#1fb857]">✆</a>
  `,
})
export class FooterComponent { readonly site = SITE; readonly app = appUrl(); readonly year = new Date().getFullYear(); readonly tel = SITE.phone.replace(/[^\d+]/g, ''); }
