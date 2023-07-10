import { ReportParameter } from './report-parameter.model';

export type JasperReport = {
  id?: number;
  parameters?: ReportParameter[];
  category?: any;
  connectionConfig?: any;
  fileName?: string;
  name?: string;
  filePath?: string;
  subReports?: JasperReport[];
  subReport?: boolean;
  reportAvailable?: boolean;
};
