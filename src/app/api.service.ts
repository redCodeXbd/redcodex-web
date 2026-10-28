import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from './config';

export interface Plan { id: string; key: string; name: string; description: string; priceMonthly: number; priceYearly: number; modules: string[] }
export interface DemoForm { name: string; company: string; email: string; phone: string; message: string; role: string; industry: string; teamSize: string; interests: string[] }

interface Gql<T> { data?: T; errors?: { message: string; extensions?: { fields?: { field: string; message: string }[] } }[] }

/**
 * Every call the website makes to the ERP backend. All of them are public (no sign-in): the plans, the editable site content,
 * the marketing tools and events, the Bangla corrections, and the demo request.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  async gql<T>(query: string, variables?: object): Promise<T> {
    const r = await firstValueFrom(this.http.post<Gql<T>>(apiUrl(), { query, variables }));
    if (r.errors?.length || !r.data) {
      const e = r.errors?.[0]; const f = e?.extensions?.fields?.[0];
      throw new Error(f ? `${f.field}: ${f.message}` : e?.message ?? 'The server did not answer.');
    }
    return r.data;
  }

  async plans(): Promise<Plan[]> {
    const r = await this.gql<{ publicPlans: (Plan & { limits: Record<string, unknown> })[] }>('{ publicPlans { id key name description priceMonthly priceYearly modules limits } }');
    // Plans made for one customer are not for sale on the public page.
    return r.publicPlans.filter((p) => !(p.limits['ui'] as { customFor?: string } | undefined)?.customFor).map((p) => ({ ...p, priceMonthly: Number(p.priceMonthly), priceYearly: Number(p.priceYearly) }));
  }

  async siteContent(): Promise<{ key: string; value: Record<string, unknown> }[]> {
    return (await this.gql<{ siteContent: { key: string; value: Record<string, unknown> }[] }>('{ siteContent { key value } }')).siteContent;
  }

  async marketingConfig(): Promise<Record<string, unknown>> {
    return (await this.gql<{ marketingConfig: Record<string, unknown> }>('{ marketingConfig }')).marketingConfig ?? {};
  }

  async trackEvent(event: object): Promise<void> {
    await this.gql('mutation($e: JSON!) { trackMarketingEvent(event: $e) }', { e: event });
  }

  async translationOverrides(): Promise<Record<string, string>> {
    return (await this.gql<{ translationOverrides: Record<string, string> }>('{ translationOverrides }')).translationOverrides ?? {};
  }

  async submitDemo(f: DemoForm, attribution: object | null): Promise<{ number: string }> {
    const r = await this.gql<{ submitDemoRequest: { number: string } }>(
      'mutation($i: DemoRequestInput!) { submitDemoRequest(input: $i) { id number } }',
      { i: { name: f.name.trim(), company: f.company.trim(), email: f.email.trim().toLowerCase(), phone: f.phone.trim(), message: f.message.trim(), data: { role: f.role, industry: f.industry.trim(), teamSize: f.teamSize, interests: f.interests, attribution } } },
    );
    return r.submitDemoRequest;
  }
}
