import md5 from 'crypto-md5';
import { getPathname } from '../utils/url';
import { respondStatic } from '../utils/http';

// Const
const PARAM_RE = /^{(\S+)}$/;

// Static
function buildRouteParamsMap (routeMatch, paramNames) {
    return paramNames.reduce((params, paramName, i) => {
        params[paramName] = routeMatch[i + 1];
        return params;
    }, {});
}

// Router
export default class Router {
    /**
    * Creates a new instance of {@link Router}.
    * @class Router
    * @classdesc Controls the redirection of HTTP requests.
    * @see Proxy
    */
    constructor () {
        this.routes           = {};
        this.routesWithParams = [];
    }

    _registerRoute (route, method, handler) {
        var tokens            = route.split('/');
        var isRouteWithParams = tokens.some(token => PARAM_RE.test(token));

        if (isRouteWithParams)
            this._registerRouteWithParams(tokens, method, handler);

        else {
            var isStatic = typeof handler !== 'function';

            if (isStatic) {
                this._processStaticContent(handler);

                handler.etag = md5(handler.content);
            }

            this.routes[`${method} ${route}`] = {
                handler:  handler,
                isStatic: isStatic
            };
        }
    }

    _registerRouteWithParams (tokens, method, handler) {
        var paramNames = [];
        var reParts    = tokens.map(token => {
            var paramMatch = token.match(PARAM_RE);

            if (paramMatch) {
                paramNames.push(paramMatch[1]);
                return '(\\S+?)';
            }

            return token;
        });

        this.routesWithParams.push({
            paramNames: paramNames,

            re:      new RegExp(`^${method} ${reParts.join('/')}$`),
            handler: handler
        });
    }

    _route (req, res, serverInfo) {
        var routerQuery = `${req.method} ${getPathname(req.url)}`;
        var route       = this.routes[routerQuery];

        if (route) {
            if (route.isStatic)
                respondStatic(req, res, route.handler);

            else
                route.handler(req, res, serverInfo);

            return true;
        }


        for (var i = 0; i < this.routesWithParams.length; i++) {
            route = this.routesWithParams[i];

            var routeMatch = routerQuery.match(route.re);

            if (routeMatch) {
                var params = buildRouteParamsMap(routeMatch, route.paramNames);

                route.handler(req, res, serverInfo, params);
                return true;
            }
        }

        return false;
    }

    _processStaticContent () {
        throw new Error('Not implemented');
    }

    // API
    
    /**
    * @external IncomingMessage
    * @see https://nodejs.org/api/http.html#http_http_incomingmessage
    */

    /**
    * @external ServerResponse
    * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
    */

    /**
    * Contains information about the router.
    * @typedef {Object} ServerInfo
    * @property {string} hostName - The name of the host where the router is located.
    * @property {string} port - The number of the port through same-domain requests are performed.
    * @property {string} crossDomainPort - The number of the port through which cross-domain requests are performed.
    * @property {string} domain - The domain address of the router.
    */

    /**
    * The handler to which requests are redirected.
    * @callback Router~Handler
    * @param {external:IncomingMessage} req - The request received by the router.
    * @param {external:ServerResponse} res - The response to be sent back by the router.
    * @param {ServerInfo} serverInfo - Information about the router, such as the hostname and ports. 
    */

    /**
    * Specifies that GET requests to the specified route should be redirected to the specified handler.
    * @function GET
    * @param {string} route - The route from which the requests will be redirected.
    * @param {Router~Handler} handler - The handler to which the requests will be redirected.
    * @memberof Router
    * @instance
    * @see {@link Router#POST|POST}
    */
    GET (route, handler) {
        this._registerRoute(route, 'GET', handler);
    }

    /**
    * Specifies that POST requests to the specified route should be redirected to the specified handler.
    * @function POST
    * @param {string} route - The route from which the requests will be redirected.
    * @param {Router~Handler} handler - The handler to which the requests will be redirected.
    * @memberof Router
    * @instance
    * @see {@link Router#GET|GET}
    */
    POST (route, handler) {
        this._registerRoute(route, 'POST', handler);
    }
}
