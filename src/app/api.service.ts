import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from './config';

export interface Plan { id: string; key: string; name: string; description: string; priceMonthly: number; priceYearly: number; modules: string[] }
export interface DemoForm { name: string; company: string; email: string; phone: string; message: string; role: string; industry: string; teamSize: string; interests: string[] }

interface Gql<T> { data?: T; errors?: { message: string }[] }

/** The two public calls the landing page makes to the backend: the plans for the price table, and the demo request. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private async gql<T>(query: string, variables?: object): Promise<T> {
    const r = await firstValueFrom(this.http.post<Gql<T>>(apiUrl(), { query, variables }));
    if (r.errors?.length || !r.data) { throw new Error(r.errors?.[0]?.message ?? 'The server did not answer.'); }
    return r.data;
  }

  async plans(): Promise<Plan[]> {
    const r = await this.gql<{ plans: (Plan & { limits: Record<string, unknown> })[] }>('{ plans { id key name description priceMonthly priceYearly modules limits } }');
    // Plans made for one customer are not for sale on the public page.
    return r.plans.filter((p) => !(p.limits['ui'] as { customFor?: string } | undefined)?.customFor).map((p) => ({ ...p, priceMonthly: Number(p.priceMonthly), priceYearly: Number(p.priceYearly) }));
  }

  async submitDemo(f: DemoForm): Promise<{ number: string }> {
    const { role, industry, teamSize, interests, ...contact } = f;
    const r = await this.gql<{ submitDemoRequest: { number: string } }>(
      'mutation($i: DemoRequestInput!) { submitDemoRequest(input: $i) { id number } }',
      { i: { ...contact, name: f.name.trim(), company: f.company.trim(), email: f.email.trim().toLowerCase(), phone: f.phone.trim(), message: f.message.trim(), data: { role, industry, teamSize, interests, attribution: { source: 'web', landing: location.href, referrer: document.referrer } } } },
    );
    return r.submitDemoRequest;
  }
}
