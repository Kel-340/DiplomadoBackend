export default class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
 
    createCategory = async (req, res) => {
        const data = { ...req.body, userId: req.user.id };
        try {
            const category = await this.categoryService.createCategory(data);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
 
    getCategories = async (req, res) => {
        try {
            const categories = await this.categoryService.getCategories(req.user.id);
            res.status(200).json(categories);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    };
 
    updateCategory = async (req, res) => {
        const { id } = req.params;
        try {
            const category = await this.categoryService.updateCategory(id, req.body, req.user.id);
            res.status(200).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
 
    deleteCategory = async (req, res) => {
        const { id } = req.params;
        try {
            const result = await this.categoryService.deleteCategory(id, req.user.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
}
 