import EventEmitter from '../utils/event-emitter';
import nativeMethods from './native-methods';

export default class SandboxBase extends EventEmitter {
    /**
    * Creates a new instance of {@link SanboxBase}.
    * @class SandboxBase
    * @classdesc Serves as the base class for sandboxes.
    * @see Sandbox
    */
    constructor () {
        super();

        /**
        * The window to which the sandbox is attached.
        * Use the {@link Sandbox#attach} method to attach a sandbox to the window.
        * @type {Object}
        * @memberof SandboxBase
        * @instance
        */
        this.window        = null;
        /**
        * Stores links to methods of Window, Document and Element objects.
        * @type {NativeMethods}
        * @instance
        */
        this.nativeMethods = nativeMethods;
    }

    /**
    * Attaches this sandbox to the specified window and document.
    * @param {Object} window - the Window object to which the sandbox should be attached.
    * @param {Object} document - the Document object to which the sandbox should be attached. If undefined, obtained through window.document.
    */
    attach (window, document) {
        this.window   = window;
        this.document = document || window.document;
    }
}
