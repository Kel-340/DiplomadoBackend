import {UserEntity} from "../../domain/entities/User.entity.js";
import { badRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../../domain/errors/AppError.js";
 
export class AuthUseCases {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }  
 
    async register( name, email, password, baseCurrency='BOB') {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ConflictError('Email already in use');
        }
       
 
        const userEntity = new UserEntity({ name, email, password, baseCurrency });
        const createdUser = await this.userRepository.create(userEntity);
        return createdUser.toPublicProfile();
    }
}