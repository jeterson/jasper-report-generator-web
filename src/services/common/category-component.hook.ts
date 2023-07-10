import { categoryService } from '../category/category.service';

const filterCategorySelect = (
  fillFn: (items: unknown[]) => void,
  val: string,
  update: (callbackFn: () => void, afterFn?: () => void) => void
) => {
  categoryService.findAll(val, undefined, false).then((categories) => {
    update(() => {
      //parentCategories.value = categories;
      fillFn(categories);
    });
  });
};

export const useCategoryComponent = () => ({
  filterCategorySelect,
});
