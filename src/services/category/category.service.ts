import { Category } from 'src/models/category/category.model';
import { HttpServiceBase } from '../http-service-base';
import { QTableColumn } from 'quasar';

export class CategoryService extends HttpServiceBase {
  constructor() {
    super('categories');
  }

  findAll(
    description: string,
    parentId?: number,
    showLoading = true
  ): Promise<Category[]> {
    return this.get(
      `?description=${description}&parentId=${parentId ?? ''}`,
      showLoading
    );
  }

  findById(id: number): Promise<Category> {
    return this.get(`/${id}`);
  }

  remove(id: number) {
    return this.delete(`/${id}`);
  }

  update(category: Category, isRoot = false): Promise<Category> {
    return this.put(`/${category.id}`, {
      description: category.description,
      parentId: isRoot ? null : category.parent?.id,
    });
  }

  create(category: Category, isRoot = false): Promise<Category> {
    return this.post('', {
      description: category.description,
      parentId: isRoot ? null : category.parent?.id,
    });
  }

  findAllAsTree(): Promise<any[]> {
    return this.get('/tree');
  }

  findColumns(): Promise<QTableColumn[]> {
    return Promise.resolve([
      { name: 'id', label: 'Código', align: 'left', field: 'id' },
      {
        name: 'description',
        label: 'Descrição',
        align: 'left',
        field: 'description',
      },
      { name: 'parent', label: 'Pai', align: 'left', field: 'parent' },
      { name: 'path', label: 'Caminho', align: 'left', field: 'path' },
      { name: 'actions', label: 'Ações', align: 'left', field: 'actions' },
    ]);
  }
}

const categoryService = new CategoryService();
export { categoryService };
