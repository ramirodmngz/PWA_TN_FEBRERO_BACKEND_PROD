import ENVIROMENT from "../config/enviroment.config.js";
import { ServerError } from "../utils/errors.util.js";
import jwt from "jsonwebtoken";



export const authMiddleware = (request, response, next) =>{
    try{
        const authorization_header = request.headers["authorization"]
        if(!authorization_header){
            throw new ServerError("No has proporcionadio un token de autenticacion", 401)
        }

        const authorization_token = authorization_header.split(" ")[1]
        if(!authorization_token){
            throw new ServerError("no has proporcionado un token de autenticacion", 401)
        }
        try{
            const user_info = jwt.verify(authorization_token, ENVIROMENT.SECRET_KEY_JWT)
            request.user = user_info
            next()
        } 
        catch(error){
            throw new ServerError("token de autenticacion invalida", 400)
        }

        

        

    } catch (error) {
        console.log("error al validar token", error);
        if (error.status) {
            return response.send({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        return response.send({
            message: "Internal server error",
            status: 500,
            ok: true
        })
    }
}
