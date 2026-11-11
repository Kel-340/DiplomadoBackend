export default class UserEntity {
    constructor({ id, name, email, password, role, baseCurrency }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role || "user";
        this.baseCurrency = baseCurrency || "BOB";
    }
}