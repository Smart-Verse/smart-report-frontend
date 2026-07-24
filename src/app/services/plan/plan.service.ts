import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

export interface PlanOption {
  id: string;
  code: string;
  name: string;
  description: string;
  monthlyPrice?: number;
  apiMonthlyLimit?: number;
  customPlan: boolean;
  currentPlan: boolean;
}

export interface PlanOverview {
  currentPlan: PlanOption;
  plans: PlanOption[];
  apiUsed: number;
  apiRemaining?: number;
}

export type BillingCycle = "MONTHLY" | "QUARTERLY" | "SEMIANNUAL";

export interface PaymentLinkResponse {
  url: string;
  orderNsu: string;
  status: string;
  reused: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  planCode: string;
  billingCycle: BillingCycle;
  amountCents: number;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "EXPIRED";
  createdAt: string;
  paidAt?: string;
  coverageStartAt?: string;
  coverageEndAt?: string;
}

export interface ApiUsageHistoryItem {
  period: string;
  amount: number;
}

export interface ApiUsageHistory {
  history: ApiUsageHistoryItem[];
}

export function formatPlanPrice(value?: number): string {
  return new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(value ?? 0);
}

@Injectable({providedIn: "root"})
export class PlanService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<PlanOverview> {
    return this.http.get<PlanOverview>("getPlanOverview");
  }

  createPaymentLink(planCode: string, billingCycle: BillingCycle): Observable<PaymentLinkResponse> {
    return this.http.post<PaymentLinkResponse>("createPaymentLink", {planCode, billingCycle});
  }

  paymentHistory(): Observable<{payments: PaymentHistoryItem[]}> {
    return this.http.get<{payments: PaymentHistoryItem[]}>("getPaymentHistory");
  }

  history(): Observable<ApiUsageHistory> {
    return this.http.get<ApiUsageHistory>("getApiUsageHistory");
  }
}
