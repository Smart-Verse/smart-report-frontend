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
  <p v-if="data.paid">Pagamento confirmado</p>
  <p v-else>Pagamento pendente</p>

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

  readonly base64Example = `const response = await fetch(API_URL + '/generateReport', {
  method: 'POST',
  headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
  body: JSON.stringify({ idreport, data })
});
if (!response.ok) throw new Error('Falha ao gerar relatório');
const { report } = await response.json();
const bytes = Uint8Array.from(atob(report), char => char.charCodeAt(0));
const pdf = new Blob([bytes], { type: 'application/pdf' });
const url = URL.createObjectURL(pdf);
window.open(url, '_blank');
setTimeout(() => URL.revokeObjectURL(url), 60_000);`;

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
