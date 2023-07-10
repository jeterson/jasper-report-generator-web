import { Category } from 'src/models/category/category.model';
import { categoryService } from './category.service';

const findAll = (description: string, parentId?: number, showLoading = true) =>
  categoryService.findAll(description, parentId, showLoading);

const findById = (id: number) => categoryService.findById(id);

const findColumns = () => categoryService.findColumns();
const remove = (id: number) => categoryService.remove(id);
const create = (category: Category) => categoryService.create(category);
const update = (category: Category, isRoot = false) =>
  categoryService.update(category, isRoot);

const findAllAsTree = () => categoryService.findAllAsTree();

export const useCategory = () => ({
  findAll,
  findColumns,
  remove,
  create,
  update,
  findById,
  findAllAsTree,
});
