import * as path from 'path';
import * as express from 'express';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as nunjucks from 'nunjucks';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';

import { useWebpackMiddleware } from './middleware/webpack.middleware';

class App {

    static VIEWS_FOLDER = path.resolve(path.join(__dirname, '../views'));
    static ASSETS_FOLDER = path.resolve(path.join(__dirname, '../public'));

    public express: express.Application;
    public ENV: string = process.env.NODE_ENV || 'production';
    public isDev: boolean = this.ENV === 'development';

    private _router: express.Router = express.Router();

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();

        nunjucks.configure(App.VIEWS_FOLDER, {
            autoescape: true,
            express: this.express,
            noCache: this.isDev
        });
    }

    // Configure Express middleware.
    private middleware(): void {

        if (this.isDev) {
            useWebpackMiddleware(this.express);
            this.express.use(logger('common'));
        } else {
            this.express.use(compression());
            this.express.use(logger('dev'));
            this.express.use(helmet()); // universal HTTP header protection
        }

        this.express.use(express.static(App.ASSETS_FOLDER));

    }

    private routes(): void {

        this._router.get('/', (req, res, next) => {
            res.render('index.njk');
        });


        this.express.use('/', this._router);
    }

}

export default new App().express;
