import { Component, inject } from '@angular/core';
import { I18nService, LANGUAGES } from './i18n.service';

/** A pill with a sliding red thumb under the chosen language. Works with the keyboard; the choice is announced to screen readers. */
@Component({
  selector: 'rcx-lang',
  standalone: true,
  template: `
    <div class="flex items-center gap-1.5" data-no-i18n>
      <div class="relative flex rounded-full bg-soft p-0.5 ring-1 ring-black/10" role="group" aria-label="Language">
        <span class="pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/2)] rounded-full bg-brand transition-transform duration-300 ease-out motion-reduce:transition-none"
              [class]="i18n.lang() === 'bn' ? 'translate-x-full' : 'translate-x-0'" aria-hidden="true"></span>
      @for (l of languages; track l.id) {
        <button type="button" class="relative z-10 min-w-[2.75rem] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                [class]="i18n.lang() === l.id ? 'text-white' : 'text-slate-600 hover:text-ink'"
                [attr.aria-pressed]="i18n.lang() === l.id" [attr.lang]="l.id" [attr.title]="l.label" (click)="i18n.set(l.id)">{{ l.short }}</button>
      }
      </div>
    </div>
  `,
})
export class LanguageSwitchComponent {
  readonly i18n = inject(I18nService);
  readonly languages = LANGUAGES;
}
