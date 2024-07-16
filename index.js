import { Server } from './modules/server.js';
import 'dotenv/config'

const server = new Server();

server.execute();