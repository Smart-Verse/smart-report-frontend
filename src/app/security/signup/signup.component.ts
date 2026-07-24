import { Component, OnInit } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { SignUp } from './signup';
import {  Router } from '@angular/router';

import { SecurityService } from '../services/security.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import {LoadingComponent} from "../../shared/loading/loading.component";

@Component({
    selector: 'app-signup',
    imports: [SharedCommonModule, LoadingComponent],
    providers: [SecurityService, ToastService],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {


  public signUp: FormGroup;
  public showLoading = false;
  public showPassword = false;
  public showResendConfirmation = false;
  private pendingEmail = "";

  constructor(
    private readonly fieldsService: FieldsService,
    private readonly router: Router,
    private readonly securityService: SecurityService,
    private readonly toastService: ToastService,
  ){
    this.signUp = this.fieldsService.onCreateFormBuiderDynamic(new SignUp().fields);
  }

  ngOnInit(): void {

  }

  onValidator(): boolean{
    if(this.signUp.valid && this.signUp.get('confirmPassword')?.value === this.signUp.get('password')?.value){
      return true;
    }
    return false;
  }

  onRegister() {
    if(!this.onValidator()){
      this.toastService.info({summary: "Erro", detail: "Existem campos no formulario invalido"});
      return;
    }
    this.showLoading = true;
    this.securityService.register(this.signUp.value).subscribe({
      next: (res) => {
        this.toastService.success({summary: "Usuario cadastrado com sucesso",detail: "Você receberá um email para continuação do cadastro!"});
        this.showLoading = false;
        this.onSign();
      },
      error: (error) => {
        this.showLoading = false;
        if (error?.status === 409 && error?.error?.message === "ACCOUNT_CONFIRMATION_PENDING") {
          this.pendingEmail = this.signUp.get("email")?.value;
          this.showResendConfirmation = true;
          return;
        }
        this.toastService.error({summary: "Erro", detail: "ocorreu um erro ao cadastrar usuário"});
      }
    });
  }

  onCloseResendConfirmation() {
    this.showResendConfirmation = false;
  }

  onResendConfirmation() {
    this.showLoading = true;
    this.securityService.resendConfirmation(this.pendingEmail).subscribe({
      next: () => {
        this.showLoading = false;
        this.showResendConfirmation = false;
        this.toastService.success({
          summary: "E-mail reenviado",
          detail: "Enviamos um novo link de ativação. Verifique também sua caixa de spam."
        });
        this.onSign();
      },
      error: () => {
        this.showLoading = false;
        this.toastService.error({
          summary: "Não foi possível reenviar",
          detail: "Tente novamente em alguns instantes."
        });
      }
    });
  }

  onSign() {
    this.router.navigate(["login"])
  }
}
