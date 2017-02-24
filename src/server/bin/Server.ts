import * as http from 'http';
import * as express from 'express';
import * as debug from 'debug';

debug('ts-express:server');

export class Server {

    static PORT_DEFAULT = 3000;

    private _port: number|string|boolean;
    private _server: http.Server;
    private _app: express.Application;

    public constructor(app: express.Application, port?: number) {
        this._app = app;
        this._port = this.normalizePort(port || Server.PORT_DEFAULT);
        this._app.set('port', this._port);
    }

    public start(): void {
        this._server = http.createServer(this._app);
        this._server.listen(this._port);
        this._server.on('error', this.onError);
        this._server.on('listening', this.onListening);
    }

    private normalizePort(val: number|string): number|string|boolean {
        const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;

        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    private onError(error: NodeJS.ErrnoException): void {

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

    private onListening(): void {
        const addr = this._server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;

        debug(`Listening on ${bind}`);
    }
}
