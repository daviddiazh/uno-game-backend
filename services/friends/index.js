import mongoose from "mongoose";
import friendsSchema from "../../models/friends.js";
import { FriendsRequestService } from "../friends-request/index.js";

export class FriendsService {
    constructor() {        
        this.db = friendsSchema;
        this.friendsRequestService = new FriendsRequestService();
    }

    async aceptRequest(payload) {
        const { userIdFrom, userIdTo } = payload;

        //TODO! validar si ya existen en la coleccion

        try {
            await this.db.create({
                usersId: [
                    userIdFrom,
                    userIdTo
                ],
            });

            await this.friendsRequestService.removeFriendRequest({ userIdFrom, userIdTo });

            return {
                ok: true,
            }
        } catch (error) {
            return {
                code: 400,
                message: 'Error al aceptar la solicitud de amistad'
            }
        }
    }

    async friendsList(payload) {
        const { userId } = payload;
        const users = await this.db.find().populate('usersId');

        return users.map(user => {
            // const dato = user.usersId.find(u => u._id != userId);
            // return dato;

            return user.usersId;
        });
    }
}
