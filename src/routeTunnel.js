const  concatMiddlewares = require('./concatMiddlewares');
const  generateRoute     = require('./generateRoute');
const  Path              = require('path');
const middleWareKernel = require('./middleWareKernel');

module.exports = function routeTunnel (app,obj,routePath,middlewares=[],options) {


        let middleware1 = middlewares;
        //if the object pass doesn't contain a string just keep on taking it deeper
        if (typeof  obj === 'object' &&  !obj.hasOwnProperty('controller') ){
            let middlewares = middleWareKernel(obj.middlewares||[],options.middlewareDirectory);
            // let concMiddlewares =  concatMiddlewares(middleware1,obj.middlewares||[]);
            if(middlewares.length > 0){
                app.use("/"+routePath,middlewares)
            }
            for (let prop in obj){


                //ignore middlewares as it has been taken care of previously
                if (prop !== 'middlewares'){

                    if (obj.hasOwnProperty(prop)){


                        let joinedPath  = Path.join(routePath,prop);
                        let objMiddleware = obj[prop].middlewares||[];
                        // let innerConcMiddlewares = this.concatMiddlewares(concMiddlewares,objMiddleware);
                        routeTunnel(app,obj[prop],joinedPath,[],options)
                    }
                }
            }

        }else if (obj.hasOwnProperty('controller')){
            generateRoute(app,routePath,obj,middlewares,options);
        }
    }
