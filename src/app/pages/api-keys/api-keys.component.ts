import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ApiKeyService, ApiKeySummary, CreatedApiKey} from '../../services/api-key/api-key.service';
import {LoadingService} from '../../shared/services/loading/loading.service';
import {ToastService} from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-api-keys',
  imports: [FormsModule, DatePipe],
  templateUrl: './api-keys.component.html',
  styleUrl: './api-keys.component.scss'
})
export class ApiKeysComponent implements OnInit {
  keys: ApiKeySummary[] = [];
  keyName = '';
  createdKey?: CreatedApiKey;
  copied = false;
  loadingKeys = true;
  loadFailed = false;
  creating = false;
  revokingId?: string;

  constructor(
    private readonly apiKeys: ApiKeyService,
    private readonly loading: LoadingService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  create(): void {
    const name = this.keyName.trim();
    if (!name || this.creating) return;

    this.creating = true;
    this.loading.showLoading.next(true);
    this.apiKeys.create(name).subscribe({
      next: key => {
        this.createdKey = key;
        this.keyName = '';
        this.creating = false;
        this.loading.showLoading.next(false);
        this.load();
      },
      error: () => {
        this.creating = false;
        this.loading.showLoading.next(false);
        this.showError('Não foi possível criar a chave', 'Verifique sua sessão e tente novamente.');
      }
    });
  }

  copyCreatedKey(): void {
    if (!this.createdKey) return;
    navigator.clipboard?.writeText(this.createdKey.apiKey).then(() => {
      this.copied = true;
      window.setTimeout(() => this.copied = false, 1800);
    });
  }

  closeReveal(): void {
    this.createdKey = undefined;
    this.copied = false;
  }

  revoke(key: ApiKeySummary): void {
    if (this.revokingId || !window.confirm(`Revogar a chave “${key.name}”? A integração deixará de funcionar imediatamente.`)) return;

    this.revokingId = key.id;
    this.apiKeys.revoke(key.id).subscribe({
      next: () => {
        this.revokingId = undefined;
        this.toast.success({summary: 'Chave revogada', detail: `${key.name} não pode mais autenticar requisições.`});
        this.load();
      },
      error: () => {
        this.revokingId = undefined;
        this.showError('Não foi possível revogar a chave', 'Tente novamente em alguns instantes.');
      }
    });
  }

  retry(): void {
    this.load();
  }

  maskedKey(key: ApiKeySummary): string {
    return `sr_live_${key.keyPrefix}_••••••••••••`;
  }

  private load(): void {
    this.loadingKeys = true;
    this.loadFailed = false;
    this.apiKeys.list().subscribe({
      next: keys => {
        this.keys = keys ?? [];
        this.loadingKeys = false;
      },
      error: () => {
        this.keys = [];
        this.loadingKeys = false;
        this.loadFailed = true;
        this.showError('Não foi possível carregar as chaves', 'Confira se o backend está atualizado e tente novamente.');
      }
    });
  }

  private showError(summary: string, detail: string): void {
    this.toast.error({summary, detail});
  }
}
