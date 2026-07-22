import {Component, OnInit} from "@angular/core";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {ApiUsageHistoryItem, PlanService} from "../../services/plan/plan.service";

@Component({
  selector: "app-usage-history",
  imports: [SharedCommonModule],
  templateUrl: "./usage-history.component.html",
  styleUrl: "./usage-history.component.scss"
})
export class UsageHistoryComponent implements OnInit {
  history: ApiUsageHistoryItem[] = [];
  loading = true;

  constructor(private readonly planService: PlanService) {}

  ngOnInit(): void {
    this.planService.history().subscribe({
      next: response => {
        this.history = response.history ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  formatPeriod(period: string): string {
    const [year, month] = period.split("-").map(Number);
    if (!year || !month) return period;
    const label = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, 1)));
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}
