import UserModel from "./user.model.js";
 
export default class UserMongoRepository {
    async save(userEntity) {
        return await UserModel.create(userEntity);
    }
    async findByEmail(email) {
        return await UserModel.findOne({ email });
    }
    async findById(id) {
        return await UserModel.findById(id);
    }
}