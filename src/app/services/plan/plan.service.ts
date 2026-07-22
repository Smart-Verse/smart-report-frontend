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

  history(): Observable<ApiUsageHistory> {
    return this.http.get<ApiUsageHistory>("getApiUsageHistory");
  }
}
