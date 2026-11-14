import { DataTypes, Op } from "sequelize";
import sequelize from "./connection.js";
 
export const CategoryModel = sequelize.define("Category", {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("INCOME", "EXPENSE"), allowNull: false },
    description: { type: DataTypes.STRING },
    userId: { type: DataTypes.STRING, allowNull: true },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });
 
export default class CategoryMySQLRepository {
    async save(categoryEntity) {
        const category = await CategoryModel.create({
            name: categoryEntity.name,
            type: categoryEntity.type,
            description: categoryEntity.description,
            userId: categoryEntity.userId,
            isDefault: categoryEntity.isDefault
        });
        return category.toJSON();
    }
 
    async findByUserIdOrDefault(userId) {
        return await CategoryModel.findAll({
            where: {
                [Op.or]: [{ isDefault: true }, { userId }]
            }
        });
    }
 
    async findById(id) {
        const category = await CategoryModel.findByPk(id);
        return category ? category.toJSON() : null;
    }
 
    async update(id, data) {
        const category = await CategoryModel.findByPk(id);
        if (!category) return null;
        await category.update(data);
        return category.toJSON();
    }
 
    async delete(id) {
        const category = await CategoryModel.findByPk(id);
        if (!category) return null;
        await category.destroy();
        return true;
    }
 
    async seedCategories() {
        const count = await CategoryModel.count({ where: { isDefault: true } });
        if (count === 0) {
            await CategoryModel.bulkCreate([
                { name: "Salario", type: "INCOME", description: "Ingreso mensual por trabajo", isDefault: true },
                { name: "Servicios Profesionales", type: "INCOME", description: "Honorarios y consultorías", isDefault: true },
                { name: "Alimentación", type: "EXPENSE", description: "Gastos de comida y supermercado", isDefault: true },
                { name: "Transporte", type: "EXPENSE", description: "Pasajes y combustible", isDefault: true },
                { name: "Vivienda y Servicios", type: "EXPENSE", description: "Alquiler, luz, agua e internet", isDefault: true },
                { name: "Educación", type: "EXPENSE", description: "Cursos, libros y posgrado", isDefault: true }
            ]);
            console.log("Seeded default categories in MySQL");
        }
    }
}
 