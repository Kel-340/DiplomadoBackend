import CategoryEntity from "../../domain/entities/category.entity.js";
 
export default class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
 
    async createCategory(data) {
        if (!data.name || !data.type) {
            throw new Error("Name and type (INCOME or EXPENSE) are required");
        }
        if (!["INCOME", "EXPENSE"].includes(data.type)) {
            throw new Error("Invalid category type. Must be INCOME or EXPENSE");
        }
 
        const category = new CategoryEntity(data);
        return await this.categoryRepository.save(category);
    }
 
    async getCategories(userId) {
        return await this.categoryRepository.findByUserIdOrDefault(userId);
    }
 
    async updateCategory(id, data, userId) {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new Error("Category not found");
        if (category.isDefault) throw new Error("Cannot update a default system category");
        if (category.userId !== userId) throw new Error("Unauthorized: You can only update your own categories");
 
        return await this.categoryRepository.update(id, data);
    }
 
    async deleteCategory(id, userId) {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new Error("Category not found");
        if (category.isDefault) throw new Error("Cannot delete a default system category");
        if (category.userId !== userId) throw new Error("Unauthorized: You can only delete your own categories");
 
        await this.categoryRepository.delete(id);
        return { message: "Category deleted successfully" };
    }
}
 