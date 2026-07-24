import {Component} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {BillingCycle, formatPlanPrice, PlanOption, PlanOverview, PlanService} from "../../services/plan/plan.service";

@Component({
  selector: "app-plan-upgrade-modal",
  imports: [SharedCommonModule],
  templateUrl: "./plan-upgrade-modal.component.html",
  styleUrl: "./plan-upgrade-modal.component.scss"
})
export class PlanUpgradeModalComponent {
  readonly overview: PlanOverview = this.config.data.overview;
  readonly formatPrice = formatPlanPrice;
  readonly cycles: Array<{key: BillingCycle; label: string; months: number; discount: number}> = [
    {key: "MONTHLY", label: "Mensal", months: 1, discount: 0},
    {key: "QUARTERLY", label: "Trimestral", months: 3, discount: 10},
    {key: "SEMIANNUAL", label: "Semestral", months: 6, discount: 15}
  ];
  selectedCycle: BillingCycle = "MONTHLY";
  loadingPlanCode?: string;
  errorMessage = "";

  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly ref: DynamicDialogRef,
    private readonly plans: PlanService
  ) {}

  get cycle() {
    return this.cycles.find(item => item.key === this.selectedCycle)!;
  }

  total(plan: PlanOption): number {
    return (plan.monthlyPrice ?? 0) * this.cycle.months * (1 - this.cycle.discount / 100);
  }

  choose(plan: PlanOption): void {
    if (plan.customPlan) {
      this.ref.close(plan);
      return;
    }
    if (plan.code === "FREE") return;
    this.errorMessage = "";
    this.loadingPlanCode = plan.code;
    this.plans.createPaymentLink(plan.code, this.selectedCycle).subscribe({
      next: response => window.location.assign(response.url),
      error: error => {
        this.loadingPlanCode = undefined;
        this.errorMessage = error?.error?.message ?? "Não foi possível iniciar o pagamento. Tente novamente.";
      }
    });
  }
}
