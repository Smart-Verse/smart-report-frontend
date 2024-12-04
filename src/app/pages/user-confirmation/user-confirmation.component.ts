import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../shared/common/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../shared/services/toast/toast.service";
import {UserConfirmationService} from "../../services/user-confirmation/user-confirmation.service";
import {SharedCommonModule} from "../../shared/common/shared-common.module";

@Component({
  selector: 'app-user-confirmation',
  standalone: true,
  imports: [
    SharedCommonModule,
  ],
  providers: [
    ToastService,
    UserConfirmationService
  ],
  templateUrl: './user-confirmation.component.html',
  styleUrl: './user-confirmation.component.scss'
})
export class UserConfirmationComponent extends BaseComponent implements OnInit {

  token: string | null = null;
  showMessage: string = "";

  constructor(
    private readonly translateRegister: TranslateService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userConfirmation: UserConfirmationService,
    private readonly toast: ToastService

  ){
    super();
  }

  ngOnInit(): void {
    this.onShowLoading();
    this.route.paramMap.subscribe(p => {
      this.token = p.get('hash');

      this.userConfirmation.onValidURL(this.token).subscribe({
        next: (res) => {
          if(res.authorize){
            this.toast.success({summary:"Conta confirmada com suceesso",detail: "Conta confirmada com sucesso"});
            this.router.navigate(["login"]);
          }
          this.onShowLoading();
        },
        error: (error) => {
          this.showMessage = "Houve uma falha ao confirmar sua conta";
          this.onShowLoading();
        }
      })

    });
  }

}
