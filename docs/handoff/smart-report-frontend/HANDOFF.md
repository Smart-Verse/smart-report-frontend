# smart-report-frontend — Handoff

## Responsabilidade e stack

SPA Angular 21 standalone para autenticação, biblioteca, documentação, configurações, API Keys e Studio. Usa PrimeNG 21, PrimeFlex, RxJS e CodeMirror 6.

## Navegação e telas

- `home/repository`: dashboard, métricas, repositórios, templates e UUID copiável.
- `home/studio/:id`: editor HTML/CSS/JS/JSON, salvar, visualizar PDF e voltar.
- `home/documentation`: guia de uso e botão para gerenciar API Keys.
- `home/apiKeys`: criar, listar e revogar chaves; segredo revelado uma única vez.
- `home/userConfiguration`: perfil, idioma e tema com layout responsivo.

Ao criar template, o modal oferece Executivo, Listagem, Gráficos e Financeiro e envia `templateType` ao backend.

## HTTP e autenticação

- Desenvolvimento: `http://localhost:5070/smartreport`.
- Produção: `https://app.smartverse.com.br/api/smartreport`.
- Existe um único HttpClient raiz em `app.config.ts`, com `withFetch()` e `authInterceptor`.
- O interceptor prefixa endpoints de negócio, envia JWT e preserva `/assets/` e uploads externos.
- Traduções e configuração de cadastro continuam locais.
- Em 401 e no logout, `clearClientSession()` limpa cookies, localStorage e sessionStorage.
- Guards retornam `UrlTree` e o logout usa `replaceUrl`.

## Tema e Studio

Tokens globais controlam claro/escuro por `.app-dark`. A preferência fica no localStorage enquanto a sessão está ativa. CodeMirror substituiu Monaco e mantém highlighting, histórico, busca, indentação e pares.

O Studio busca `getTemplate`, salva em `saveTemplate` e gera em `generateReport`. A resposta contém PDF em base64.

## Validação

```bash
npm install
npm start
npm run build
npm test
```

O build deve permanecer abaixo de 5 MB.

## Pontos de atenção

- O cookie JWT mantém o nome legado `outh`.
- Muitos contratos ainda usam `any`; conferir runtime após regenerar backend.
- Outputs gerados podem envolver dados em `output`; mapear explicitamente.
- Não registrar outro `provideHttpClient()` sem o interceptor.
- Providers usados por páginas lazy, como `MessageService`, devem estar no injetor raiz.
- Qualquer novo asset local deve permanecer isento do prefixo da API.

## Planos

`PlanService` consulta `GET getPlanOverview`; preços, franquias, textos e ordem vêm do catálogo administrativo do backend. Não fixar valores comerciais no Angular.

Quando o plano atual é `FREE`, `home/userConfiguration` apresenta consumo do mês e os cards responsivos dos planos. Templates aparecem como livres em todas as opções. Os botões pagos apenas registram visualmente a intenção por enquanto; checkout e troca de assinatura ainda não foram implementados.

- `home/usageHistory`: listagem mensal das gerações autenticadas por API.
- A biblioteca mostra um aviso para contas Free e abre `PlanUpgradeModalComponent`; catálogo e valores continuam vindo de `PlanService`.
- Valores monetários usam `Intl.NumberFormat`, evitando dependência de locale Angular não registrado.

