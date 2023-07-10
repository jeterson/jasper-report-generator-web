import { JasperReport } from 'src/models/report/report.model';
import { HttpServiceBase } from '../http-service-base';
import { QTableColumn } from 'quasar';

export class ReportService extends HttpServiceBase {
  constructor() {
    super('reports');
  }

  findById(id: number): Promise<any> {
    return this.get(`/${id}`);
  }

  remove(id: number): Promise<void> {
    return this.delete(`/${id}`);
  }

  isReportFileAvailable(id: number): Promise<boolean> {
    return this.get(`/is-report-file-available/${id}`);
  }

  async createReportWithFile(report: any, file: File): Promise<JasperReport> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('report', JSON.stringify(report));
    const response = await this.api.post('/reports', formData);
    return response.data;
  }

  async update(report: any, file: File | null = null): Promise<JasperReport> {
    const formData = new FormData();
    if (file) formData.append('file', file);

    formData.append('report', JSON.stringify(report));
    const response = await this.api.put('/reports', formData);
    return response.data;
  }

  findAll(
    reportName: string,
    categoryId: number | null,
    categoryPath: string
  ): Promise<JasperReport[]> {
    return this.get(
      `?reportName=${reportName}&categoryId=${
        !categoryId ? '' : categoryId
      }&path=${categoryPath}`
    );
  }

  getColumns(): Promise<QTableColumn[]> {
    return Promise.resolve([
      { name: 'id', label: 'Código', align: 'left', field: 'id' },
      { name: 'name', label: 'Nome', align: 'left', field: 'name' },
      {
        name: 'category',
        label: 'Categoria',
        align: 'left',
        field: 'category',
      },
      {
        name: 'connectionConfig',
        label: 'Fonte de Dados',
        align: 'left',
        field: 'connectionConfig',
      },
      { name: 'fileName', label: 'Arquivo', align: 'left', field: 'fileName' },
      {
        name: 'reportAvailable',
        label: 'Arquivo Disponível',
        align: 'left',
        field: 'reportAvailable',
      },
      { name: 'actions', label: 'Ações', align: 'left', field: 'actions' },
    ]);
  }
}

const reportService = new ReportService();
export { reportService };
