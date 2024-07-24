import { verifyJwt } from '../../middlewares/verify-jwt.js';
import { AuthService } from '../../services/auth/index.js';

class GameSockets {
    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', async( socket ) => {

            const { valid, _id } = await verifyJwt( socket.handshake.query['token']  );

            if ( !valid ) {
                return socket.disconnect();
            };

            socket.join(_id);

            socket.on( 'invitation-to-tame', async( payload ) => {
                const user = await new AuthService().findById(payload?.userIdFrom)
                this.io.to( payload.userIdTo ).emit( 'invitation-to-tame', { userInviting: user, userInvited: payload?.userIdTo } );
            });

            socket.on( 'start-game', async( payload ) => {
                this.io.to( payload.userIdInvited ).emit( 'start-game', { userInviting: payload?.userIdInvited, userInvited: payload?.userIdFrom } );
                this.io.to( payload.userIdInviting ).emit( 'start-game', { userInviting: payload?.userIdInvited, userInvited: payload?.userIdInviting } );
            });
            
            socket.on('disconnect', async() => {
                //TODO: quitar juego
            });
        });
    }
}

export default GameSockets;