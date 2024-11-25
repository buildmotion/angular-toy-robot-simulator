export class StatusMessage {
  severity!: 'success' | 'error' | 'info';
  summary!: string;
  detail!: string;

  constructor(severity: 'success' | 'error' | 'info', summary: string, detail: string) {
    this.severity = severity;
    this.summary = summary;
    this.detail = detail;
  }
}
