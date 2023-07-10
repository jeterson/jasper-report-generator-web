import {
  ConnectionConfig,
  ConectionConfigView,
  ReportDatabase,
} from 'src/models/connectionconfig/connection-config.model';
import { connectionConfigService } from './connection-config.service';
import { QTableColumn } from 'quasar';

const findById = (id: number) => connectionConfigService.findById(id);
const update = (connectionConfig: ConectionConfigView) =>
  connectionConfigService.update(connectionConfig);
const remove = (id: number): Promise<void> =>
  connectionConfigService.remove(id);
const findAll = (
  name: string,
  database: ReportDatabase
): Promise<ConnectionConfig[]> =>
  connectionConfigService.findAll(name, database);

const getColumns = (): Promise<QTableColumn[]> =>
  connectionConfigService.getTableColumns();

const create = (connectionConfig: ConectionConfigView) =>
  connectionConfigService.create(connectionConfig);

const findAllAvailableDatabases = async (includeNone = false) =>
  (await connectionConfigService.findAllAvailableDatabases()).filter((x) =>
    includeNone ? true : x !== ReportDatabase.NONE
  );

export const useConnectionConfig = () => ({
  findById,
  update,
  create,
  findAll,
  remove,
  getColumns,
  findAllAvailableDatabases,
});
