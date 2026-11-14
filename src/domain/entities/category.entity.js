export default class CategoryEntity {
    constructor({ id, name, type, description, userId, isDefault }) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description || null;
        this.userId = userId || null;
        this.isDefault = isDefault || false;
    }
}
 