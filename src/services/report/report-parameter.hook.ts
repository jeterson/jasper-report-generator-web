import { reportParameterService } from './report-parameters.service';

const findById = (id: number) => reportParameterService.findById(id);

const findParametersType = () => reportParameterService.findParametersTypes();
const update = (reportParameter: any) =>
  reportParameterService.update(reportParameter);

const create = (reportId: number, reportParameter: any) =>
  reportParameterService.create(reportId, reportParameter);

const remove = (id: number) => reportParameterService.remove(id);

const createFromXml = (reportId: number): Promise<boolean> =>
  reportParameterService.createFromJrxml(reportId);

export const useReportParameter = () => ({
  findById,
  findParametersType,
  createFromXml,
  update,
  create,
  remove,
});
