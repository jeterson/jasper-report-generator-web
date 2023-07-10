export type ReportParamType =
  | 'STRING'
  | 'DATE'
  | 'INTEGER'
  | 'BOOLEAN'
  | 'DECIMAL'
  | 'ARRAY';
export type ReportParameter = {
  id?: number;
  name?: string;
  type?: ReportParamType;
  reportType?: ReportParamType;
  pattern?: string;
  defaultValue?: any;
  createdManually?: boolean;
  reportParameterView?: ReportParameterView;
};

export type ReportParameterView = {
  label?: string;
  required?: boolean;
  visible?: boolean;
  sortOrder: number;
  id?: number;
};

export type ReportParameterValue = {
  [key: string]: any;
};
