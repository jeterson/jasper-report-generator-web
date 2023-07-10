export enum ReportDatabase {
  ORACLE = 'ORACLE',
  SQLITE = 'SQLITE',
  NONE = 'NONE',
}

export interface ConnectionConfigEditableField<T> {
  value: T;
  edition: boolean;
}

export interface ConfigConnectionStatus {
  ok: boolean;
  message: string;
}
export interface ConnectionConfig {
  connectionUrl: string;
  database?: ReportDatabase;
  name: string;
  status: ConfigConnectionStatus;
  id?: number;
}

export interface ConectionConfigView extends ConnectionConfig {
  actions?: any;
  password?: string;
  username?: string;
}
