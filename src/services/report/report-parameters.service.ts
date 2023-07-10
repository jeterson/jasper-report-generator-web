import { ReportParamType } from 'src/models/report/report-parameter.model';
import { HttpServiceBase } from '../http-service-base';
import { boot } from 'quasar/wrappers';

export class ReportParameterService extends HttpServiceBase {
  constructor() {
    super('parameters');
  }

  findById(id: number): Promise<any> {
    return this.get(`/${id}`);
    //return Promise.resolve();
  }

  findParametersTypes(): Promise<ReportParamType[]> {
    return this.get('/types');
    //return Promise.resolve();
  }

  createFromJrxml(reportId: number): Promise<boolean> {
    return this.patch(`/create-from-jrxml/report/${reportId}`);
    //return Promise.resolve(true);
  }

  update(reporParameter: any) {
    return this.put(`/${reporParameter.id}`, reporParameter);
    //return Promise.resolve();
  }

  remove(id: number) {
    return this.delete(`/${id}`);
    //return Promise.resolve();
  }

  create(reportId: number, reporParameter: any) {
    return this.post('', { ...reporParameter, reportId });
    //return Promise.resolve();
  }
}

const reportParameterService = new ReportParameterService();
export { reportParameterService };
