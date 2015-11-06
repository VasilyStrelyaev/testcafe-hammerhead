import XHR_HEADERS from './xhr/headers';
import Charset from '../processing/encoding/charset';
import * as urlUtils from '../utils/url';
import * as contentTypeUtils from '../utils/content-type';

// TODO: Rewrite parseProxyUrl instead.
function flattenParsedProxyUrl (parsed) {
    if (parsed) {
        return {
            dest: {
                url:           parsed.destUrl,
                protocol:      parsed.destResourceInfo.protocol,
                host:          parsed.destResourceInfo.host,
                hostname:      parsed.destResourceInfo.hostname,
                port:          parsed.destResourceInfo.port,
                partAfterHost: parsed.destResourceInfo.partAfterHost,
                resourceType:  parsed.resourceType,
                charset:       parsed.charset
            },

            sessionId: parsed.sessionId
        };
    }
}

function getContentTypeUrlToken (isScript, isIframe) {
    if (isScript) return urlUtils.SCRIPT;
    if (isIframe) return urlUtils.IFRAME;

    return null;
}

/**
* @external Buffer
* @see https://nodejs.org/api/buffer.html#buffer_class_buffer
*/

/**
* Contains information about the request destination
* @typedef {Object} RequestDestination
* @property {string} url - The destination URL.
* @property {string} protocol - The destination protocol.
* @property {string} host - The destination host.
* @property {string} hostname - The destination hostname.
* @property {string} port - The destination port.
* @property {string} domain - The destination domain.
* @property {string} partAfterHost - The URL part that follows the host.
* @property {?string} resourceType - The type of the requested resource ('iframe', 'script' or null - for other resources)
* @property {string} charset - The charset expected in the response.
* @property {?string} referer - The referer URL.
* @property {?string} reqOrigin - The referer domain.
*/

/**
* Contains information about the request content
* @typedef {Object} RequestContentInfo
* @property {string} charset - the result content's charset.
* @property {boolean} requireProcessing - indicates whether the result requires processing.
* @property {boolean} isIframeWithImageSrc - indicates whether the result is an iframe that has an Image as a src. 
* @property {boolean} isCSS - indicates whether CSS is being requested.
* @property {boolean} isScript - indicates whether a script is being requested. 
* @property {boolean} isManifest - indicates whether a manifest is being requested.
* @property {boolean} isJSON - indicates whether JSON is being requested.
* @property {string} encoding - the result's encoding.
* @property {string} contentTypeUrlToken - the result's content type.
*/

export default class RequestPipelineContext {
    /**
    * Creates a new instance of {@link RequestPipelineContext}
    * @class RequestPipelineContext
    * @classdesc Provides context available during the request pipelining.
    * @param {external:IncomingMessage} req - The request received.
    * @param {external:ServerResponse} res - The response to be sent back.
    * @param {ServerInfo} serverInfo - Information about the server, such as the hostname and ports. 
    */
    constructor (req, res, serverInfo) {
        /**
        * Information about the server, such as the hostname and ports. 
        * @member {ServerInfo} serverInfo
        * @memberof RequestPipelineContext
        * @instance
        */
        this.serverInfo = serverInfo;
        /**
        * The current {@link Session}.
        * @member {Session} session
        * @memberof RequestPipelineContext
        * @instance
        */
        this.session    = null;

        /**
        * The request received.
        * @member {external:IncomingMessage} req
        * @memberof RequestPipelineContext
        * @instance
        */
        this.req     = req;
        /**
        * The binary data contained within the request body.
        * @member {external:Buffer} reqBody
        * @memberof RequestPipelineContext
        * @instance
        */
        this.reqBody = null;
        /**
        * The response to be sent back.
        * @member {external:ServerResponse} res
        * @memberof RequestPipelineContext
        * @instance
        */
        this.res     = res;

        /**
        * Contains info about the request destination.
        * @member {RequestDestination} dest
        * @memberof RequestPipelineContext
        * @instance
        */
        this.dest          = null;
        /**
        * The response received from the destination.
        * @member {external:IncomingMessage} destRes
        * @memberof RequestPipelineContext
        * @instance
        */
        this.destRes       = null;
        /**
        * The binary data contained within the response body.
        * @member {external:Buffer} destResBody
        * @memberof RequestPipelineContext
        * @instance
        */
        this.destResBody   = null;
        /**
        * Indicates if the destination request contained an error
        * @member {boolean} hasDestReqErr
        * @memberof RequestPipelineContext
        * @instance
        */
        this.hasDestReqErr = false;

        /**
        * Indicates if the request is an XHR request
        * @member {boolean} isXhr
        * @memberof RequestPipelineContext
        * @instance
        */
        this.isXhr       = false;
        /**
        * Indicates if the request is a page request
        * @member {boolean} isPage
        * @memberof RequestPipelineContext
        * @instance
        */
        this.isPage      = false;
        /**
        * Indicates if the request is an iframe request
        * @member {boolean} isIframe
        * @memberof RequestPipelineContext
        * @instance
        */
        this.isIframe    = false;
        /**
        * Contains information about the request content.
        * @member {RequestContentInfo} contentInfo
        * @memberof RequestPipelineContext
        * @instance
        */
        this.contentInfo = null;

        var acceptHeader = req.headers['accept'];

        this.isXhr  = !!req.headers[XHR_HEADERS.requestMarker];
        this.isPage = !this.isXhr && acceptHeader && contentTypeUtils.isPage(acceptHeader);
    }

    _getDestFromReferer (parsedReferer) {
        // NOTE: Browsers may send the default port in the ‘referer’ header. But since we compose the destination
        // URL from it, we need to skip the port number if it's the protocol’s default port. Some servers have
        // host conditions that do not include a port number.
        var rDest         = parsedReferer.dest;
        var isDefaultPort = rDest.protocol === 'https:' && rDest.port === '443' ||
                            rDest.protocol === 'http:' && rDest.port === '80';

        var dest = {
            protocol:      rDest.protocol,
            host:          isDefaultPort ? rDest.host.split(':')[0] : rDest.host,
            hostname:      rDest.hostname,
            port:          isDefaultPort ? '' : rDest.port,
            partAfterHost: this.req.url
        };

        dest.url = urlUtils.formatUrl(dest);

        return {
            dest:      dest,
            sessionId: parsedReferer.sessionId
        };
    }

    _isFileDownload () {
        var contentDisposition = this.destRes.headers['content-disposition'];

        return contentDisposition &&
               contentDisposition.indexOf('attachment') > -1 &&
               contentDisposition.indexOf('filename') > -1;
    }

    _getInjectable (injectable) {
        return injectable.map(url => this.serverInfo.domain + url);
    }

    _initRequestNatureInfo () {
        var acceptHeader = this.req.headers['accept'];

        this.isXhr    = !!this.req.headers[XHR_HEADERS.requestMarker];
        this.isPage   = !this.isXhr && acceptHeader && contentTypeUtils.isPage(acceptHeader);
        this.isIframe = this.dest.resourceType === urlUtils.IFRAME;
    }

    // API

    /**
    * Starts dispatching the request.
    * @param {Object.<string, Session>} openSessions - sessions that are open on the server, indexed by Session.id.
    * @returns {boolean} true if dispatching has been successfully started; otherwise, false.
    * @memberof RequestPipelineContext
    * @instance
    */
    dispatch (openSessions) {
        var parsedReqUrl  = urlUtils.parseProxyUrl(this.req.url);
        var referer       = this.req.headers['referer'];
        var parsedReferer = referer && urlUtils.parseProxyUrl(referer);

        // TODO: Remove it after parseProxyURL is rewritten.
        parsedReqUrl  = flattenParsedProxyUrl(parsedReqUrl);
        parsedReferer = flattenParsedProxyUrl(parsedReferer);

        // NOTE: Try to extract the destination from the ‘referer’ header.
        if (!parsedReqUrl && parsedReferer)
            parsedReqUrl = this._getDestFromReferer(parsedReferer);

        if (parsedReqUrl) {
            this.session = openSessions[parsedReqUrl.sessionId];

            if (!this.session)
                return false;

            this.dest        = parsedReqUrl.dest;
            this.dest.domain = urlUtils.getDomain(this.dest);

            if (parsedReferer) {
                this.dest.referer   = parsedReferer.dest.url;
                this.dest.reqOrigin = urlUtils.getDomain(parsedReferer.dest);
            }

            this._initRequestNatureInfo();

            return true;
        }

        return false;
    }
  
    /**
    * Calculates the {@link RequestPipelineContext#contentInfo|contentInfo} property value.
    * @memberof RequestPipelineContext
    * @instance
    */
    buildContentInfo () {
        var contentType = this.destRes.headers['content-type'] || '';
        var accept      = this.req.headers['accept'] || '';
        var encoding    = this.destRes.headers['content-encoding'];

        var isCSS      = contentTypeUtils.isCSSResource(contentType, accept);
        var isManifest = contentTypeUtils.isManifest(contentType);
        var isJSON     = contentTypeUtils.isJSON(contentType);
        var isScript   = this.dest.resourceType === urlUtils.SCRIPT ||
                         contentTypeUtils.isScriptResource(contentType, accept);

        var requireProcessing = !this.isXhr &&
                                (this.isPage || this.isIframe || isCSS || isScript || isManifest || isJSON);

        var isIframeWithImageSrc = this.isIframe && !this.isPage && /^\s*image\//.test(contentType);

        var charset             = null;
        var contentTypeUrlToken = getContentTypeUrlToken(isScript, this.isIframe);

        // NOTE: We need charset information if we are going to process the resource.
        if (requireProcessing) {
            charset = new Charset();

            if (!charset.fromContentType(contentType))
                charset.fromUrl(this.dest.charset);
        }

        if (this._isFileDownload())
            this.session.handleFileDownload();

        this.contentInfo = {
            charset,
            requireProcessing,
            isIframeWithImageSrc,
            isCSS,
            isScript,
            isManifest,
            isJSON,
            encoding,
            contentTypeUrlToken
        };
    }

    /**
    * Returns URLs of scripts that should be injected into the proxied page or iframe.
    * @returns {string[]} An array of URLs where injectable scripts are located.
    * @memberof RequestPipelineContext
    * @instance
    * @see {@link RequestPipelineContext#getInjectableStyles|getInjectableStyles}
    */
    getInjectableScripts () {
        var taskScript = this.isIframe ? '/iframe-task.js' : '/task.js';
        var scripts    = this.session.injectable.scripts.concat(taskScript);

        return this._getInjectable(scripts);
    }

    /**
    * Returns URLs of stylesheets that should be injected into the proxied page or iframe.
    * @returns {string[]} An array of URLs where injectable stylesheets are located.
    * @memberof RequestPipelineContext
    * @instance
    * @see {@link RequestPipelineContext#getInjectableScripts|getInjectableScripts}
    */
    getInjectableStyles () {
        return this._getInjectable(this.session.injectable.styles);
    }

    /**
    * Sends the response that redirects to the specified URL.
    * @param {string} url - The URL to which to redirect.
    * @memberof RequestPipelineContext
    * @instance
    */
    redirect (url) {
        this.res.statusCode = 302;
        this.res.setHeader('location', url);
        this.res.end();
    }

    /**
    * Closes the connection with client with an error.
    * @param {number} statusCode - The HTTP status code.
    * @param {string|external:Buffer} resBody - Data to be written to the response body.
    * @memberof RequestPipelineContext
    * @instance
    */
    closeWithError (statusCode, resBody) {
        this.res.statusCode = statusCode;

        if (resBody) {
            this.res.setHeader('content-type', 'text/html');
            this.res.end(resBody);
        }
        else
            this.res.end();
    }

    /**
    * Converts the specified origin URL to a proxy URL.
    * @param {string} url - The origin URL to be converted to the proxy URL.
    * @param {boolean} isCrossDomain - specifies if the URL is cross-domain.
    * @param {string} resourceType - type of the resource the URL points to.
    * @param {string} charsetAttrValue - the charset expected in the response.
    * @returns {string} The proxy URL converted from the specified origin URL.
    * @memberof RequestPipelineContext
    * @instance
    */
    toProxyUrl (url, isCrossDomain, resourceType, charsetAttrValue) {
        var port = isCrossDomain ? this.serverInfo.crossDomainPort : this.serverInfo.port;

        return urlUtils.getProxyUrl(url, this.serverInfo.hostname, port, this.session.id, resourceType, charsetAttrValue);
    }
}
