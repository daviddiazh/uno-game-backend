import friendsRequestSchema from '../../models/friendsRequest';

export class FriendsRequestService {
    constructor() {
        this.db = friendsRequestSchema;
    }
  
    async friendRequest(payload) {
      try {
        const { userIdFrom, userIdTo } = payload;
  
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
          const { userIdFrom } = payload;
    
          await this.db.find({ userIdFrom });
        } catch (error) {
            return {
              code: 404,
              message: 'Error al filtrar las solicitudes de amistad envíadas',
            }
        }
    }

    async requestReceived(payload) {
        try {
          const { userIdTo } = payload;
    
          await this.db.find({ userIdTo });
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
