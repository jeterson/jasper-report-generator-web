import {
  ConectionConfigView,
  ConnectionConfig,
  ReportDatabase,
} from 'src/models/connectionconfig/connection-config.model';
import { HttpServiceBase } from '../http-service-base';
import { QTableColumn } from 'quasar';

export class ConnectionConfigService extends HttpServiceBase {
  constructor() {
    super('connection-config');
  }
  findById(id: number): Promise<ConnectionConfig> {
    return this.get(`/${id}`);
  }
  findAll(name: string, database: ReportDatabase): Promise<ConnectionConfig[]> {
    return this.get(`?name=${name}&database=${database}`);
  }
  remove(id: number): Promise<void> {
    return this.delete(`/${id}`);
  }
  update(config: ConectionConfigView): Promise<ConnectionConfig> {
    return this.put(`/${config.id}`, config);
  }
  create(config: ConectionConfigView): Promise<ConnectionConfig> {
    return this.post('', config);
  }
  findAllAvailableDatabases(): Promise<ReportDatabase[]> {
    return this.get('/databases');
  }

  getTableColumns(): Promise<QTableColumn[]> {
    return Promise.resolve([
      { name: 'id', label: 'Código', align: 'left', field: 'id' },
      { name: 'name', label: 'Nome', align: 'left', field: 'name' },
      {
        name: 'database',
        label: 'Banco de Dados',
        align: 'left',
        field: 'database',
      },
      {
        name: 'connectionUrl',
        label: 'URL',
        align: 'left',
        field: 'connectionUrl',
      },
      {
        name: 'status',
        label: 'Status',
        align: 'left',
        field: 'status',
      },
      { name: 'actions', label: 'Ações', align: 'left', field: 'actions' },
    ]);
  }
}

const connectionConfigService = new ConnectionConfigService();
export { connectionConfigService };
