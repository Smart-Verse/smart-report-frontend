import {ApplicationConfig, inject, provideAppInitializer} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {TranslateService} from "./shared/services/translate/translate.service";
import {RegisterService} from "./shared/services/register/register.service";
import {providePrimeNG} from "primeng/config";
import Aura from "@primeuix/themes/aura";
import {MessageService} from "primeng/api";
import {authInterceptor} from "./config/interceptor/auth-interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    providePrimeNG({
      ripple: true,
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
      translation: {
        firstDayOfWeek: 0,
        dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: "Hoje",
        clear: "Limpar"
      }
    }),
    provideAppInitializer(() => inject(RegisterService).loadModelRegister()),
    provideAppInitializer(() => inject(TranslateService).loadTranslations()),
  ]
};
