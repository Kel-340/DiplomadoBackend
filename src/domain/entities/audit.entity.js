export default class AuditEntity {
    constructor({ id, action, entity, entityId, details, userId }) {
        this.id = id;
        this.action = action;
        this.entity = entity;
        this.entityId = String(entityId);
        this.details = details || null;
        this.userId = userId;
    }
}