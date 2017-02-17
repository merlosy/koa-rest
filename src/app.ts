import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-body-parser';
import * as http from 'http';
import * as https from 'https';
import * as cors from 'cors';
import * as Router from 'koa-router';


// Creates and configures an koaJS web server.
export default class App {

  // ref to koa instance
  public koa: Koa;
  private config: any = {};
  private router: Router;

  private static readonly defaultConfig = {
      port : process.env.PORT,
      secure: false,
      secureOptions: {}
  }

  /**
   * Set the global configuration for the app to be
   * @see https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
   */
  constructor(config?) {
    Object.assign(this.config, App.defaultConfig, config);
    this.koa = new Koa();
    this.routes();
    this.middleware();
  }

  public getConfig(){
    return this.config;
  }

  public quickRun(): void {
    if (!!this.config.secure){
      https.createServer(this.config.secureOptions, this.koa.callback()).listen(this.config.port);
    } else {
      http.createServer(this.koa.callback()).listen(this.config.port);
    }
  }

  public createServer(): http.Server | https.Server {
    if (!!this.config.secure){
      return https.createServer(this.config.secureOptions, this.koa.callback());
    } else {
      return http.createServer(this.koa.callback());
    }
  }

  /**
   *  Configure koa middleware.
   * @see https://github.com/cnpm/koa-middlewares
   */
  private middleware(): void {
    this.koa.use( logger() );
    this.koa.use(bodyParser({enableTypes: ['json', 'form', 'text'] }) );
    // this.koa.use(cors());
  }

  /**
   * Configure API endpoints.
   * @see https://github.com/alexmingoia/koa-router
   * @see https://github.com/alexmingoia/koa-resource-router
   */
  private routes(): void {
    // init koa router
    this.router = new Router();

    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    // this.koa.use(function *(){
    //     this.body = 'Hello world';    
    // });

    this.router.get('/', function *(next){
        this.body = 'API is working!';    
    });

    // set router as middleware
    this.koa
      .use(this.router.routes())
      .use(this.router.allowedMethods());
  }

}

// export default App;