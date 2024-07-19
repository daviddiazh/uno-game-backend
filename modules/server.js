import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';

import passport from '../middlewares/passport.js';
import Sockets from './sockets.js';
import { dbConnection } from './database.js';

export class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT ?? 9000;

        dbConnection();

        this.server = http.createServer( this.app );

        this.io = new SocketServer( this.server, {} );
    }

    async middlewares() {
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use(passport.initialize());

        const loginController = await import('../controllers/auth/index.js');
        this.app.use( '/api/auth', loginController.default );

        const friendsRequestController = await import('../controllers/friends-request/index.js');
        this.app.use( '/api/friends-request', friendsRequestController.default );
    }

    configureSockets() {
        new Sockets( this.io );
    }

    execute() {
        this.middlewares();

        this.configureSockets();

        this.server.listen( this.port, () => {
            console.log('Server listen in port:', this.port );
        });
    }
}
