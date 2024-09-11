import UserDto from "../../dto/users.dto.js";
import { usersModel } from "../../models/users.model.js";
import { CustomError } from "../../service/errors/custom.error.js";
import { EError } from "../../service/errors/enums.js";

export default class UserDao {
    constructor(cartService) {
        this.model = usersModel;
        this.cartService = cartService;
    }

    async getAll() {
        return await this.model.find().lean()
    }

    async getAllFiltered() {
        let result
        try {
            result = await this.model.find({}, 'fullname rol email age')
        } catch (error) {
            result = {
                message: 'Cannot get users, try again or contact the administrator', 
                result: error.message
            };
        }
        return result
    }

    async create(user) {
        let result
        try {
            const cart = await this.cartService.newCart()
            const newUser = new UserDto(user)
            newUser.cart = cart._id
            result = {
                message: 'User created successfully',
                result: await this.model.create(newUser)
            };
        } catch (error) {
            result = {
                message: 'Cannot create user, try again or contact the administrator', 
                result: error.message
            }
        }
        return result;
    }

    async delete(filter) {
        let result
        try {
            result = await this.model.deleteMany(filter)
        } catch (error) {
            result = {
                message: 'Cannot delete users, try again or contact the administrator', 
                result: error.message
            }
        }
        return result
    }

    async getPopulated(_id) {
        let result 
        try {
            result = await this.model.find({_id}).populate('cart').lean();
        } catch (error) {
            result = undefined;
        }
        return result;
    }

    async getBy(filter) {
        let result;
        try {
            result = await this.model.findOne(filter);
        } catch (error) {
            result = false
        }
        return result;
    }

    async changePassword(_id, password) {
        let result;
        try {
            result = await this.model.updateOne({_id}, {password} )
        } catch (error) {
            result = {
                message: 'Cannot change the user password, try again or contact the administrator', 
                result: error.message
            };
        }
        return result
    }

    async switchRol(_id) {
        let result
        if(!this.checkDocument()) {
            return  {
                message: 'Cannot change the user rol, you must first upload your DNI, CD and CEC'
            }
        }
        try {
            const user = await this.model.findOne({_id})
            let rol
            if(user.rol.toUpperCase() === 'ADMIN') {
                result = {
                    message: 'the user rol cannot be admin'
                }
            } else {
                user.rol.toUpperCase() === 'PREMIUM' ? rol = 'user' : rol = 'premium'
            }
            result = await this.model.updateOne({_id}, {rol})
        } catch (error) {
            result = {
                message: 'Cannot change the user rol, try again or contact the administrator', 
                result: error.message
            }
        }
        return result
    }

    async updateConnection(_id) {
        let result;
        try {
            result = await this.model.updateOne({_id}, {last_connection: Date.now()} )
        } catch (error) {
            result = {
                message: 'Cannot change the user last_connection, try again or contact the administrator', 
                result: error.message
            };
        }
        return result
    }

    async updateDocuments(filter, file, req_user, param_user_id) {
        if(!file) {
            CustomError.createError({
                name: 'Missing parameters',
                cause:  'Required parameters: thumbnail file',
                message: 'Error adding the product',
                code: EError.NOT_THUMBNAIL_FILE
            })
        }
        if(req_user.rol.toUpperCase() !== 'ADMIN' && param_user_id !== req_user._id) {
            CustomError.createError({
                name: 'Not allowed',
                cause:  'user id not accepted for update',
                message: 'you are not allowed to update documents with this user',
                code: EError.UPDATE_NOT_ALLOWED_ERROR
            })
        }

        let result        
        const reference = `uploads/users/${req_user._id}/${filter.type}/${file.filename}`
        const name = filter.document_type
        try {
            const doc = await this.model.findOne({ _id: req_user._id, "documents.name": name });
            if (doc) {
                result = await this.model.updateOne(
                    { _id: req_user._id, "documents.name": name },
                    { $set: { "documents.$.reference": reference } }
                );
            } else {
                result = await this.model.findByIdAndUpdate(
                    { _id: req_user._id },
                    { $push: { documents: { name, reference } } }
                );
            }
        } catch (error) {
            result = {
                message: 'Cannot update the document, try again or contact the administrator', 
                result: error.message
            };
        }
        
        return result
    }

    async checkDocument(_id) {
        let result
        const required_docs = ['CD', 'DNI', 'CEC'];
        try {
            const user = await this.model.findOne({_id})
            const docs = user.documents.map(doc => doc.name);
            result = required_docs.every(doc => docs.includes(doc));
        } catch (error) {
            result = {
                message: 'Cannot check the documents, try again or contact the administrator', 
                result: error.message
            };
        }
        return result
    }

}