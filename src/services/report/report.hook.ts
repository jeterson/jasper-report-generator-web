import { reportService } from './report.service';

const findById = (id: number) => reportService.findById(id);
const isReportFileAvailable = (id: number) =>
  reportService.isReportFileAvailable(id);

const createReportWithFile = (report: any, file: File) =>
  reportService.createReportWithFile(report, file);

const update = (report: any, file: File | null = null) =>
  reportService.update(report, file);

const remove = (id: number) => reportService.remove(id);

const columns = () => reportService.getColumns();

const findAll = (
  reportName: string,
  categoryId: number | null,
  categoryPath: string
) => reportService.findAll(reportName, categoryId, categoryPath);

export const useReport = () => ({
  findById,
  isReportFileAvailable,
  createReportWithFile,
  update,
  remove,
  columns,
  findAll,
});
