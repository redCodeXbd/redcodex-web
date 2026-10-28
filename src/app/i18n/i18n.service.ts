import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api.service';
import { DomTranslator } from './dom-translator';

export type Lang = 'en' | 'bn';
export const LANGUAGES: { id: Lang; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'bn', label: 'বাংলা', short: 'বাং' },
];
const KEY = 'rcx.lang';

/**
 * English is what the templates are written in. Bangla is applied on top by DomTranslator, which swaps the words on
 * the screen from a dictionary, so the whole page changes at once and back. The choice is kept in this browser;
 * `?lang=bn` in the address wins, so a link can open the page in Bangla.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.initial());
  private dom = new DomTranslator();
  private api = inject(ApiService);
  private loaded = false;

  constructor() {
    effect(() => { document.documentElement.lang = this.lang(); void this.apply(this.lang()); });
  }

  set(l: Lang): void {
    this.lang.set(l);
    try { localStorage.setItem(KEY, l); } catch { /* the choice lasts for this visit only */ }
  }

  private async apply(l: Lang): Promise<void> {
    if (l === 'en') { this.dom.stop(); return; }
    // The Bangla corrections made on the ERP's Translations page win over the built-in text.
    if (!this.loaded) { const [{ BN }, fixes] = await Promise.all([import('./bn'), this.api.translationOverrides().catch(() => ({}))]); this.dom.setDictionary({ ...BN, ...fixes }); this.loaded = true; }
    if (this.lang() === 'bn') { this.dom.start(); }
  }

  private initial(): Lang {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'bn' || q === 'en') { return q; }
    try { const v = localStorage.getItem(KEY); if (v === 'bn' || v === 'en') { return v; } } catch { /* default below */ }
    return 'en';
  }
}
