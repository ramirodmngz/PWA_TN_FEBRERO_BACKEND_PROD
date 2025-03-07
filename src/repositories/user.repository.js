import User,{USER_PROPS} from "../models/User.model.js";
import { ServerError } from "../utils/errors.util.js";

class UserRepository {
    async create({username, email, password, verification_token}) {
        try {
            await User.create({[USER_PROPS.USERNAME]: username, [USER_PROPS.EMAIL]: email, [USER_PROPS.PASSWORD]: password,[USER_PROPS.VERIFICATION_TOKEN]: verification_token});
        }
        catch (error) {
            console.log(error)
            if(error.code === 11000){
                if(error.keyPattern.username){
                    throw new ServerError("username already exists", 400);
                }
                if(error.keyPattern.email){
                    throw new ServerError("email already exists", 400);
                }
            throw error;
        }


    }
}

async verifyUserByEmail (email){
    const user_found = await User.findOne({[USER_PROPS.EMAIL]: email});
    if(!user_found){
        throw new ServerError("user not found", 404)
    }

    if(user_found.verified){
        throw new ServerError("email already verified", 400)
    }
    user_found.verified = true
    await user_found.save()
    return user_found
}

    async findUserByEmail(email){
        return await User.findOne({[USER_PROPS.EMAIL]: email})
    }

    async changeUserPassword(id, newPassword) {
        const foundUser = await User.findById(id)
        if(!foundUser) throw new ServerError('User not found', 404)
        foundUser.password = newPassword
        await foundUser.save()
    }

}





export default new UserRepository();