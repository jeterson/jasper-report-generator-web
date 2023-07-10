export interface Category {
  id?: number;
  description?: string;
  path?: string;
  parent?: Category;
}

export interface CategoryView extends Category {
  actions?: any[];
}
