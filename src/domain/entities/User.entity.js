export class UserEntity {
    constructor({ id=null, name, email, password, baseCurrency = 'BOB',isActive=true,  createdAt= new Date(), updatedAt }) {
        if (!name || String(name).trim().length < 2) {
            throw new BadRequestError('Name is required and must be at least 2 characters long');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email|| !emailRegex.test(String(email).trim())) {
            throw new BadRequestError('A valid email is required');
        }
        if (!baseCurrency || String(baseCurrency).trim().length !== 3) {
            throw new BadRequestError('Base currency is required and must be a 3-letter code');
        }
 
        this.id = id;
        this.name = String(name).trim();
        this.email = String(email).trim().toLocaleLowerCase();
        this.password = password;
        this.baseCurrency = String(baseCurrency).trim().toUpperCase();
        this.isActive = Boolean(isActive);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt || createdAt;
    }
 
    toPublicProfile() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            baseCurrency: this.baseCurrency,
            isActive: this.isActive,
            createdAt: this.createdAt
        };
    }
 
}