import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy } from '@angular/core';
import { MarketingService } from './marketing/marketing.service';
import { ConsentComponent } from './marketing/consent.component';
import { AboutComponent } from './sections/about.component';
import { ClientsComponent } from './sections/clients.component';
import { ContactComponent } from './sections/contact.component';
import { CustomComponent } from './sections/custom.component';
import { ElectroComponent } from './sections/electro.component';
import { ErpComponent } from './sections/erp.component';
import { FooterComponent } from './sections/footer.component';
import { HeaderComponent } from './sections/header.component';
import { HeroComponent } from './sections/hero.component';
import { PricingComponent } from './sections/pricing.component';
import { ProductsComponent } from './sections/products.component';
import { SistersComponent } from './sections/sisters.component';

const SECTIONS = ['products', 'erp', 'electro', 'pricing', 'custom', 'about', 'sisters', 'demo'];

/** The page, plus what it reports to the backend: a page view, each section seen (once), and the clicks that matter. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AboutComponent, ClientsComponent, ConsentComponent, HeaderComponent, HeroComponent, ProductsComponent, ErpComponent, ElectroComponent, PricingComponent, CustomComponent, SistersComponent, ContactComponent, FooterComponent],
  template: `
    <rcx-header />
    <main><rcx-hero /><rcx-clients /><rcx-products /><rcx-erp /><rcx-electro /><rcx-pricing /><rcx-custom /><rcx-about /><rcx-sisters /><rcx-contact /></main>
    <rcx-footer /><rcx-consent />
  `,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private mk = inject(MarketingService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private seen = new Set<string>();
  private io?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.mk.track('page_view', { page: location.pathname, title: document.title });
    this.io = new IntersectionObserver((es) => es.forEach((e) => {
      const id = (e.target as HTMLElement).id;
      if (e.isIntersecting && !this.seen.has(id)) { this.seen.add(id); this.mk.track('view_section', { section: id }); }
    }), { threshold: 0.35 });
    // Pricing appears after its plans load, so look again shortly.
    const watch = () => SECTIONS.forEach((id) => { const el = this.host.querySelector('#' + id); if (el) { this.io!.observe(el); } });
    watch(); setTimeout(watch, 1500);
  }
  ngOnDestroy(): void { this.io?.disconnect(); }

  @HostListener('click', ['$event'])
  onClick(e: Event): void {
    const el = e.target as HTMLElement;
    if (el.closest('rcx-lang')) { setTimeout(() => this.mk.track('language_switch', { language: document.documentElement.lang })); return; }
    const a = el.closest('a');
    if (!a) { return; }
    const href = a.getAttribute('href') ?? '';
    const where = a.closest('header') ? 'header' : a.closest('footer') ? 'footer' : a.closest('section')?.id || 'page';
    if (href.startsWith('tel:')) { this.mk.track('click_phone'); }
    else if (href.includes('wa.me')) { this.mk.track('click_whatsapp'); }
    else if (href.startsWith('mailto:')) { this.mk.track('click_email'); }
    else if (a.hasAttribute('data-sign-in')) { this.mk.track('click_sign_in', { where }); }
    else if (href === '#demo') { a.hasAttribute('data-plan') ? this.mk.track('select_plan', { plan: a.getAttribute('data-plan')! }) : this.mk.track('click_request_demo', { where }); }
    else if (/^https?:\/\//.test(href)) { this.mk.track('outbound_click', { destination: href.replace(/^https?:\/\//, '') }); }
  }
}
