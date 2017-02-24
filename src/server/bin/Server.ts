import * as http from 'http';
import * as debug from 'debug';

debug('ts-express:server');

export class ServerFunctions {

    private _port: number | string;
    private _server: http.Server;

    public normalizePort(val: number|string): number|string|boolean {
        const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;

        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    public onError(error: NodeJS.ErrnoException): void {

        if (error.syscall != 'listen') {
            throw error;
        }

        let bind = (typeof this._port === 'string') ? 'Pipe ' +  this._port : 'Port ' +  this._port;

        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    public onListening(): void {
        const addr = this._server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;

        debug(`Listening on ${bind}`);
    }
}
