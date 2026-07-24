import {Component, OnInit} from "@angular/core";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {ApiUsageHistoryItem, formatPlanPrice, PaymentHistoryItem, PlanService} from "../../services/plan/plan.service";

@Component({
  selector: "app-usage-history",
  imports: [SharedCommonModule],
  templateUrl: "./usage-history.component.html",
  styleUrl: "./usage-history.component.scss"
})
export class UsageHistoryComponent implements OnInit {
  history: ApiUsageHistoryItem[] = [];
  payments: PaymentHistoryItem[] = [];
  loading = true;
  paymentLoading = true;
  readonly formatPrice = (cents: number) => formatPlanPrice(cents / 100);

  constructor(private readonly planService: PlanService) {}

  ngOnInit(): void {
    this.planService.history().subscribe({
      next: response => { this.history = response.history ?? []; this.loading = false; },
      error: () => this.loading = false
    });
    this.planService.paymentHistory().subscribe({
      next: response => { this.payments = response.payments ?? []; this.paymentLoading = false; },
      error: () => this.paymentLoading = false
    });
  }

  formatPeriod(period: string): string {
    const [year, month] = period.split("-").map(Number);
    if (!year || !month) return period;
    const label = new Intl.DateTimeFormat("pt-BR", {month: "long", year: "numeric", timeZone: "UTC"})
      .format(new Date(Date.UTC(year, month - 1, 1)));
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  formatDate(value?: string): string {
    return value ? new Intl.DateTimeFormat("pt-BR", {dateStyle: "short", timeStyle: "short"}).format(new Date(value)) : "—";
  }

  cycleLabel(cycle: PaymentHistoryItem["billingCycle"]): string {
    return {MONTHLY: "Mensal", QUARTERLY: "Trimestral", SEMIANNUAL: "Semestral"}[cycle];
  }

  statusLabel(status: PaymentHistoryItem["status"]): string {
    return {PENDING: "Pendente", PAID: "Pago", FAILED: "Falhou", CANCELLED: "Cancelado", EXPIRED: "Expirado"}[status];
  }
}
