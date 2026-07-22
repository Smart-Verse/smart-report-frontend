import {Component} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {formatPlanPrice, PlanOption, PlanOverview} from "../../services/plan/plan.service";

@Component({
  selector: "app-plan-upgrade-modal",
  imports: [SharedCommonModule],
  templateUrl: "./plan-upgrade-modal.component.html",
  styleUrl: "./plan-upgrade-modal.component.scss"
})
export class PlanUpgradeModalComponent {
  readonly overview: PlanOverview = this.config.data.overview;
  readonly formatPrice = formatPlanPrice;

  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly ref: DynamicDialogRef
  ) {}

  choose(plan: PlanOption): void {
    this.ref.close(plan);
  }
}
