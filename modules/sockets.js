import { AuthService } from "../services/auth/index.js";
import { verifyJwt } from '../middlewares/verify-jwt.js';
import { FriendsService } from "../services/friends/index.js";

class Sockets {
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

            await new AuthService().updateUserLogged( _id, true );

            socket.join( _id );

            this.io.emit( 'get-friends-list', await new FriendsService().friendsList({ userId: _id }) );

            socket.on( 'mensaje-personal', async( payload ) => {
                // const mensaje = await grabarMensaje( payload );
                // this.io.to( payload.userIdFrom ).emit( 'mensaje-personal', mensaje );
                // this.io.to( payload.userIdTo ).emit( 'mensaje-personal', mensaje );
            });
            
            socket.on('disconnect', async() => {
                await new AuthService().updateUserLogged( _id, false );
                this.io.emit( 'get-friends-list', await new FriendsService().friendsList({ userId: _id }) );
            });
        });
    }
}

export default Sockets;