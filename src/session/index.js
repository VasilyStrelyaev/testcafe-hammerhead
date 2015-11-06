import mustache from 'mustache';
import uuid from 'node-uuid';
import { readSync as read } from 'read-file-relative';
import { EventEmitter } from 'events';
import Cookies from './cookies';
import UploadStorage from '../upload/storage';
import COMMAND from './command';
import { parseProxyUrl } from '../utils/url';

// Const
const TASK_TEMPLATE = read('../client/task.js.mustache');

// Session

export default class Session extends EventEmitter {
    /**
    * Creates a new instance of {@link Session}.
    * @class Session
    * @classdesc A session on a proxy server.
    * @param {string} uploadsRoot - the path where resource uploaded to the proxy server will be stored.
    */
    constructor (uploadsRoot) {
        super();

        this.uploadStorage = new UploadStorage(uploadsRoot);

        this.id            = Session._generateSessionId();
        this.cookies       = new Cookies();
        this.proxy         = null;
        this.pageLoadCount = 0;
        this.injectable    = {
            scripts: ['/hammerhead.js'],
            styles:  []
        };
    }

    static _generateSessionId () {
        // NOTE: GH-116
        return uuid.v4().substr(0, 3);
    }

    async handleServiceMessage (msg, serverInfo) {
        if (this[msg.cmd])
            return await this[msg.cmd](msg, serverInfo);


        throw new Error('Malformed service message or message handler is not implemented');
    }

    getTaskScript (referer, cookieUrl, serverInfo, isIframe, withPayload) {
        var cookies       = this.cookies.getClientString(cookieUrl);
        var payloadScript = '';

        if (withPayload)
            payloadScript = isIframe ? this._getIframePayloadScript() : this._getPayloadScript();

        var taskScript = mustache.render(TASK_TEMPLATE, {
            cookie:               cookies.replace(/'/g, "\\'"),
            sessionId:            this.id,
            isFirstPageLoad:      this.pageLoadCount === 0,
            serviceMsgUrl:        serverInfo.domain + '/messaging',
            ie9FileReaderShimUrl: serverInfo.domain + '/ie9-file-reader-shim',
            crossDomainPort:      serverInfo.crossDomainPort,
            payloadScript:        payloadScript,
            referer:              referer
        });

        this.pageLoadCount++;

        return taskScript;
    }

    /**
    * @function _getIframePayloadScript
    * @desc Override this function so that it returns the script that should be inserted in all Iframes on a proxied page.
    * @returns {string} The script to be inserted in all Iframes on a proxied page.
    * @memberof Session
    * @instance
    */
    _getIframePayloadScript () {
        throw new Error('Not implemented');
    }

    /**
    * @function _getIframePayloadScript
    * @desc Override this function so that it returns the script that should be inserted in the proxied page.
    * @returns {string} The script to be inserted in the proxied page.
    * @memberof Session
    * @instance
    */
    _getPayloadScript () {
        throw new Error('Not implemented');
    }

    /**
    * @function handleFileDownload
    * @desc Override this function so that it handles file download.
    * @param {RequestPipelineContext} ctx - request pipeline context
    * @memberof Session
    * @instance
    */
    handleFileDownload (/* ctx */) {
        throw new Error('Not implemented');
    }

    /**
    * @function handlePageError
    * @desc Override this function so that it handles JS errors that happen on a page.
    * @param {RequestPipelineContext} ctx - request pipeline context
    * @param {string} err - error message
    * @memberof Session
    * @instance
    */
    handlePageError (/* ctx, err */) {
        throw new Error('Not implemented');
    }

    /**
    * @function getAuthCredentials
    * @desc Override this function so that it returns user credentials.
    * @returns {{username: string, password: string}} User credentials
    * @memberof Session
    * @instance
    */
    getAuthCredentials () {
        throw new Error('Not implemented');
    }
}

// Service message handlers
var ServiceMessages = Session.prototype;

ServiceMessages[COMMAND.setCookie] = function (msg) {
    var parsedUrl = parseProxyUrl(msg.url);
    var cookieUrl = parsedUrl ? parsedUrl.destUrl : msg.url;

    this.cookies.setByClient(cookieUrl, msg.cookie);

    return this.cookies.getClientString(cookieUrl);
};

ServiceMessages[COMMAND.getIframeTaskScript] = function (msg, serverInfo) {
    var referer     = msg.referer || '';
    var refererDest = referer && parseProxyUrl(referer);
    var cookieUrl   = refererDest && refererDest.destUrl;

    return this.getTaskScript(referer, cookieUrl, serverInfo, true, false);
};

ServiceMessages[COMMAND.uploadFiles] = async function (msg) {
    return await this.uploadStorage.store(msg.fileNames, msg.data);
};

ServiceMessages[COMMAND.getUploadedFiles] = async function (msg) {
    return await this.uploadStorage.get(msg.filePaths);
};
