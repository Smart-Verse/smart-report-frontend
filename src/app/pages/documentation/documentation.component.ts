import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SharedCommonModule} from '../../shared/common/shared-common.module';

@Component({
  selector: 'app-documentation',
  imports: [SharedCommonModule, RouterLink],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss'
})
export class DocumentationComponent {
  copiedSnippet?: string;

  copy(text: string, snippet: string): void {
    navigator.clipboard?.writeText(text).then(() => {
      this.copiedSnippet = snippet;
      window.setTimeout(() => this.copiedSnippet = undefined, 1800);
    });
  }

  readonly htmlExample = `<section class="invoice">
  <h1>{{ data.company }}</h1>
  <p>Cliente: {{ data.customer.name }}</p>

  <table>
    <tr v-for="item in data.items" :key="item.id">
      <td>{{ item.description }}</td>
      <td>{{ formatCurrency(item.total) }}</td>
    </tr>
  </table>
</section>`;

  readonly jsonExample = `{
  "company": "Minha Empresa",
  "customer": { "name": "Cliente Exemplo" },
  "items": [
    { "id": 1, "description": "Serviço", "total": 150.00 }
  ]
}`;

  readonly jsExample = `function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}`;

  readonly curlExample = `curl -X POST "https://app.smartverse.com.br/api/smartreport/generateReport" \\
  -H "X-API-Key: SUA_CHAVE_DE_API" \\
  -H "Content-Type: application/json" \\
  -d '{
    "idreport": "UUID_DO_TEMPLATE",
    "data": {
      "company": "Minha Empresa",
      "customer": { "name": "Cliente Exemplo" },
      "items": []
    }
  }'`;
}
