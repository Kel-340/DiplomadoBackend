import { DataTypes } from "sequelize";
import sequelize from "./connection.js";
 
export const AuditModel = sequelize.define("Audit", {
    action: { type: DataTypes.STRING, allowNull: false },
    entity: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.JSON, allowNull: true },
    userId: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });
 
export default class AuditMySQLRepository {
    async save(auditEntity) {
        const audit = await AuditModel.create({
            action: auditEntity.action,
            entity: auditEntity.entity,
            entityId: String(auditEntity.entityId),
            details: auditEntity.details,
            userId: auditEntity.userId
        });
        return audit.toJSON();
    }
 
    async findByUserId(userId) {
        return await AuditModel.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]]
        });
    }
}
 
 