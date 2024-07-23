import { AuthService } from "../services/auth/index.js";
import { verifyJwt } from '../middlewares/verify-jwt.js';

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

            socket.join(_id);
            
            await new AuthService().updateUserLogged( _id, true );

            this.io.emit('get-users-list', await new AuthService().findUsers());

            socket.on('get-users-list', async (name) => {
                socket.emit('get-users-list', await new AuthService().findUsers(name));
            });

            socket.on( 'mensaje-personal', async( payload ) => {
                // const mensaje = await grabarMensaje( payload );
                // this.io.to( payload.userIdFrom ).emit( 'mensaje-personal', mensaje );
                // this.io.to( payload.userIdTo ).emit( 'mensaje-personal', mensaje );
            });
            
            socket.on('disconnect', async() => {
                await new AuthService().updateUserLogged( _id, false );
                this.io.emit('get-users-list', await new AuthService().findUsers());
            });
        });
    }
}

export default Sockets;