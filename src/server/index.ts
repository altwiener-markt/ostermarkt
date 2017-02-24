import { Server } from './bin/Server';
import App from './bin/App';

const server = new Server(App);
server.start();
