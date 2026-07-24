# smart-report-frontend — Handoff

> Estado consolidado em 22/07/2026.

## Responsabilidade e stack

SPA Angular 21 standalone para autenticação, biblioteca, Studio, documentação, configurações, planos, histórico de consumo e API Keys.

- Angular 21 e TypeScript.
- PrimeNG 21 e PrimeFlex.
- CodeMirror 6.
- Temas claro e escuro por tokens CSS.

## Navegação

- `/login`: autenticação.
- `/singup`: cadastro histórico; preservar o nome enquanto não houver migração coordenada.
- `home/repository`: biblioteca, métricas, repositórios e templates.
- `home/studio/:id`: edição e visualização.
- `home/documentation`: guia de integração e diretivas.
- `home/usageHistory`: histórico mensal de geração por API.
- `home/apiKeys`: criação, listagem e revogação de chaves.
- `home/userConfiguration`: perfil, idioma, tema e cards dos planos.

Contas Free veem um aviso na biblioteca e podem abrir `PlanUpgradeModalComponent`. A contratação ainda não altera o plano.

## Studio e templates

O Studio edita quatro arquivos: HTML, CSS, JavaScript e JSON. CodeMirror oferece highlighting, histórico, busca, indentação e pares.

A interface não deve citar a tecnologia interna usada para interpretar templates. Documentar apenas o contrato suportado:

- interpolação `{{ data.campo }}`;
- condicionais `v-if` e `v-else`;
- repetição `v-for`;
- atributos dinâmicos `:key`, `:class` e `:style`;
- funções auxiliares declaradas em `script.js`.

Modelos iniciais: Executivo, Listagem, Gráficos e Financeiro.

## HTTP e sessão

- Desenvolvimento: `http://localhost:5070/smartreport`.
- Produção: `https://app.smartverse.com.br/api/smartreport`.
- Manter um único `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`.
- O interceptor prefixa URLs de negócio e adiciona o JWT do cookie `outh`.
- `/assets/` e uploads externos aprovados não recebem o prefixo.
- Traduções e configuração de cadastro são assets locais.
- Em 401 e no logout, limpar cookies, `localStorage` e `sessionStorage`.
- Guards retornam boolean ou `UrlTree`.

## Planos

`PlanService` consome:

- `GET getPlanOverview`: catálogo, plano atual e uso;
- `GET getApiUsageHistory`: histórico mensal.

Preços, descrições, franquias e ordem vêm do backend. Não fixar valores comerciais no Angular. Usar `Intl.NumberFormat` para moeda, pois o locale Angular `pt-BR` não está registrado globalmente.

## Identidade

- Tokens principais: `--surface`, `--surface-soft`, `--text`, `--text-muted`, `--border`, `--primary`.
- Todo componente novo deve funcionar em claro, escuro e mobile.
- A marca SmartVerse aparece nas telas de autenticação.
- O favicon SmartReport está em `src/favicon.svg`; `favicon.ico` é fallback.
- Não adicionar outro provider local de `HttpClient` ou `MessageService` em páginas lazy.

## Build e publicação

```bash
npm install
npm run build
```

Saída: `dist/smart-report-frontend`. O bundle deve permanecer abaixo de 5 MB.

Após publicar, validar:

- base path e refresh das rotas Angular;
- login, logout e cookie;
- carregamento de traduções;
- temas;
- biblioteca e Studio;
- geração humana;
- API Keys;
- overview dos planos;
- modal de upgrade;
- histórico mensal;
- favicon.

## Pontos de atenção

- Muitos contratos antigos ainda usam `any`.
- Outputs gerados podem possuir wrapper; mapear explicitamente.
- Checkout, pagamento e troca automática de plano não foram implementados.
- Não expor detalhes internos do renderizador na interface ou no material comercial.
