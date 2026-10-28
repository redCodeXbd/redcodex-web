import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, ProductsComponent, ErpComponent, ElectroComponent, PricingComponent, CustomComponent, SistersComponent, ContactComponent, FooterComponent],
  template: `
    <rcx-header /><main><rcx-hero /><rcx-products /><rcx-erp /><rcx-electro /><rcx-pricing /><rcx-custom /><rcx-sisters /><rcx-contact /></main><rcx-footer />
  `,
})
export class AppComponent {}
