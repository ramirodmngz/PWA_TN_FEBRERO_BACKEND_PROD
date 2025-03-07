import Workspace from "../models/Workspace.model.js";
import { ServerError } from "../utils/errors.util.js";
class WorkspaceRepository {
    async findWorkspaceById(id){
        return await Workspace.findById(id)
    }


    async createWorkspace({name, owner_id}){
        const workspace = await Workspace.create(
            {
                name, 
                owner: owner_id,
                members: [owner_id] 
            }
        )
        return workspace
    }
    async addNewMember({workspace_id, owner_id, invited_id}){
        const workspace_found = await this.findWorkspaceById(workspace_id)

        //q exista el workspace
        if(!workspace_found){
            throw new ServerError("workspace not found", 404)
        }

        //q sea el dueño
        console.log(owner_id, workspace_found.owner)
        if(!workspace_found.owner.equals(owner_id)){
            throw new ServerError("you are not the owner of this workspace", 403)
        }


        //q no exista el usuario en el workspace
        if(workspace_found.members.includes(invited_id)){
            throw new ServerError("user already in workspace", 400)
        }

        workspace_found.members.push(invited_id)
        await workspace_found.save()
        return workspace_found
    }
}
const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository