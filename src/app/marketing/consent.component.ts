import { Component, computed, inject } from '@angular/core';
import { MarketingService } from './marketing.service';

/** Asks whether the site may measure visits with the connected tools. Shown only when a tool is connected and the visitor has not chosen yet. */
@Component({
  selector: 'rcx-consent',
  standalone: true,
  template: `
    @if (show()) {
      <div class="pop fixed bottom-4 left-4 right-4 z-50 max-w-sm rounded-2xl bg-white p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.07] sm:right-auto" role="dialog" aria-label="Cookies and measuring">
        <div class="font-medium">Can we measure our website?</div>
        <p class="mt-1.5 text-sm leading-relaxed text-slate-500">We use cookies and small tags from {{ names() }} to count visits and see which ads work. We never send your name, email or phone number to them.</p>
        <div class="mt-4 flex gap-2">
          <button type="button" class="btn btn-red flex-1 !py-2.5" (click)="m.setConsent('granted')">Accept</button>
          <button type="button" class="btn btn-line flex-1 !py-2.5" (click)="m.setConsent('denied')">No thanks</button>
        </div>
      </div>
    }
  `,
})
export class ConsentComponent {
  readonly m = inject(MarketingService);
  show = computed(() => this.m.anyActive() && (this.m.consent() === 'unknown' || this.m.reopen()));
  names = computed(() => this.m.active().map((d) => d.name).join(', '));
}
