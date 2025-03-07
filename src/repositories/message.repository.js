import Message from "../models/Message.model.js";
import { ServerError } from "../utils/errors.util.js";
import channelRepository from "./channel.repository.js";
import workspaceRepository from "./workspace.repository.js";

class MessageRepository {

    

    async createMessage({sender_id, channel_id, content }){

        const channel_found = await channelRepository.findChannelById(channel_id)
        if(!channel_found){
            throw new ServerError("channel not found", 404)
        }
        //                                                         Pongo .tostring para que la propiedad object id pase a string
        // const workspace_found = await workspaceRepository.findWorkspaceById(channel_found.workspace.toString()) 
        if(!channel_found.workspace.members.includes(sender_id)){
            throw new ServerError("user is not member of this workspace", 403)
        }

        const new_message = await Message.create({
            sender: sender_id,
            channel: channel_id,
            content: content
        })
        return new_message
    }

    async findMessagesFromChannel({channel_id, user_id}){
        const channel_found = await channelRepository.findChannelById(channel_id)
        if(!channel_found){
            throw new ServerError("channel not found", 404)
        }

        if(!channel_found.workspace.members.includes(user_id)){
            throw new ServerError("user is not member of this workspace", 403)
        }
        // if(!channel_found.workspace.members.includes(user_id)){
        //     throw new ServerError("user is not member of this workspace", 403)
        // }
        // const messagesList = await Message.find({channel: channel_id}).populate("sender", "username email")
        const messagesList = await Message.find({channel: channel_id})
        .populate("sender", "username")
        // .populate("channel")
        return messagesList
    }
}

const messageRepository = new MessageRepository()

export default messageRepository