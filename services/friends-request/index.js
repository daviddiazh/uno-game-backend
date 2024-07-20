import mongoose from 'mongoose';
import friendsRequestSchema from '../../models/friendsRequest.js';

export class FriendsRequestService {
    constructor() {
        this.db = friendsRequestSchema;
    }
  
    async friendRequest(payload) {
      try {
        const { userIdFrom, userIdTo } = payload;

        const findRequest = await this.db.findOne({ userIdFrom, userIdTo });
        const findRequest2 = await this.db.findOne({ userIdFrom: userIdTo, userIdTo: userIdFrom });

        if (findRequest || findRequest2) {
          return {
            code: 400,
            message: 'Error al envíar la solicitud de amistad',
          }
        }
  
        await this.db.create({ userIdFrom, userIdTo });
      } catch (error) {
        return {
            code: 400,
            message: 'Error al envíar la solicitud de amistad',
        }
      }
    }

    async requestSended(payload) {
        try {
          const { userId } = payload;
    
          return await this.db.find({ userIdFrom: userId }).populate('userIdTo');
        } catch (error) {
            return {
              code: 404,
              message: 'Error al filtrar las solicitudes de amistad envíadas',
            }
        }
    }

    async requestReceived(payload) {
        try {
          const { userId } = payload;
    
          return await this.db.find({ userIdTo: userId }).populate('userIdFrom');
        } catch (error) {
            return {
              code: 400,
              message: 'Error al envíar la solicitud de amistad',
            }
        }
    }

    async removeFriendRequest(payload) {
        try {
          const { userIdFrom, userIdTo } = payload;
    
          await this.db.deleteOne({ userIdFrom, userIdTo });
        } catch (error) {
            return {
              code: 400,
              message: 'Error al eliminar la solicitud de amistad',
            }
        }
    }
}
