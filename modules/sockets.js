import { AuthService } from "../services/auth/index.js";
import { verifyJwt } from '../middlewares/verify-jwt.js';

class Sockets {
    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', async( socket ) => {
            const { valid, _id } = verifyJwt( socket.handshake.query['x-token']  );

            if ( !valid ) {
                console.log('socket no identificado');
                return socket.disconnect();
            }

            await new AuthService().updateUserLogged( _id, newStatus );

            // Unir al usuario a una sala de socket.io
            socket.join( _id );

            // TODO: Emitir todos los usuarios conectados
            // this.io.emit( 'lista-usuarios', await /* method here */ );

            socket.on( 'mensaje-personal', async( payload ) => {
                // const mensaje = await grabarMensaje( payload );
                // this.io.to( payload.from ).emit( 'mensaje-personal', mensaje );
                // this.io.to( payload.to ).emit( 'mensaje-personal', mensaje );
            });
            
            socket.on('disconnect', async() => {
                await new AuthService().updateUserLogged( _id, newStatus );
                // this.io.emit( 'lista-usuarios', await /* method here */ );
            });
        });
    }
}

export default Sockets;