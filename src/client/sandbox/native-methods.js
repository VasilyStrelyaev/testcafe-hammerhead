/*global Document, Window */
class NativeMethods {
    /**
    * @class NativeMethods
    * @classdesc Preserves native methods of BOM and DOM objects. They will be used to call the original methods on a patched BOM/DOM object.
    * Creates a new instance of {@link NativeMethods}.
    */
    constructor () {
        this.refreshDocumentMeths();
        this.refreshElementMeths();
        this.refreshWindowMeths();
    }

    /**
    * Refreshes the stored Document methods from the specified Document object.
    * @params {Object} doc - the Document object from which methods are copied.
    */
    refreshDocumentMeths (doc) {
        doc = doc || document;

        // Dom
        /**
        * Document's [createDocumentFragment]{https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.createDocumentFragment = doc.createDocumentFragment || Document.prototype.createDocumentFragment;
        /**
        * Document's [createElement]{https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.createElement          = doc.createElement || Document.prototype.createElement;
        /**
        * Document's [createElementNS]{https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.createElementNS        = doc.createElementNS || Document.prototype.createElementNS;
        /**
        * Document's [open]{https://developer.mozilla.org/en-US/docs/Web/API/Document/open} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.documentOpen           = doc.open || Document.prototype.open;
        /**
        * Document's [close]{https://developer.mozilla.org/en-US/docs/Web/API/Document/close} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.documentClose          = doc.close || Document.prototype.close;
        /**
        * Document's [write]{https://developer.mozilla.org/en-US/docs/Web/API/Document/write} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.documentWrite          = doc.write || Document.prototype.write;
        /**
        * Document's [writeln]{https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.documentWriteLn        = doc.writeln || Document.prototype.writeln;
        /**
        * Document's [elementFromPoint]{https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.elementFromPoint       = doc.elementFromPoint || Document.prototype.elementFromPoint;
        /**
        * Document's [getElementById]{https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.getElementById         = doc.getElementById || Document.prototype.getElementById;
        /**
        * Document's [getElementsByClassName]{https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.getElementsByClassName = doc.getElementsByClassName || Document.prototype.getElementsByClassName;
        /**
        * Document's [getElementsByName]{https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.getElementsByName      = doc.getElementsByName || Document.prototype.getElementsByName;

        /**
        * Document's [getElementsByTagName]{https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.getElementsByTagName = doc.getElementsByTagName || Document.prototype.getElementsByTagName;
        /**
        * Document's [querySelector]{https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.querySelector        = doc.querySelector || Document.prototype.querySelector;
        /**
        * Document's [querySelectorAll]{https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.querySelectorAll     = doc.querySelectorAll || Document.prototype.querySelectorAll;

        // Event
        /**
        * Document's [addEventListener]{https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.documentAddEventListener    = doc.addEventListener || Document.prototype.addEventListener;
        /**
        * Document's [removeEventListener]{https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.documentRemoveEventListener = doc.removeEventListener || Document.prototype.removeEventListener;
    }

    /**
    * Refreshes the stored Element methods using the specified Document and Window objects.
    * @params {Object} doc - the Document object used to obtain the Element methods.
    * @params {Object} win - the Window object used to obtain the Element methods.
    */
    refreshElementMeths (doc, win) {
        win = win || window;

        var createElement = tagName => this.createElement.call(doc || document, tagName);
        var nativeElement = createElement('div');

        // Dom
        /**
        * Div's [appendChild]{https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.appendChild                   = nativeElement.appendChild;
        /**
        * Div's [cloneNode]{https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.cloneNode                     = nativeElement.cloneNode;
        /**
        * Div's [getElementsByClassName]{https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.elementGetElementsByClassName = nativeElement.getElementsByClassName;
        /**
        * Div's [getElementsByTagName]{https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.elementGetElementsByTagName   = nativeElement.getElementsByTagName;
        /**
        * Div's [querySelector]{https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.elementQuerySelector          = nativeElement.querySelector;
        /**
        * Div's [querySelectorAll]{https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.elementQuerySelectorAll       = nativeElement.querySelectorAll;
        /**
        * Div's [getAttribute]{https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.getAttribute                  = nativeElement.getAttribute;
        /**
        * Div's [getAttributeNS]{https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.getAttributeNS                = nativeElement.getAttributeNS;
        /**
        * Div's [insertAdjacentHTML]{https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.insertAdjacentHTML            = nativeElement.insertAdjacentHTML;
        /**
        * Div's [insertBefore]{https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.insertBefore                  = nativeElement.insertBefore;
        /**
        * Tr's [insertCell]{https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.insertCell                    = createElement('tr').insertCell;
        /**
        * Table's [insertRow]{https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/insertRow} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.insertTableRow                = createElement('table').insertRow;
        /**
        * Tbody's [insertRow]{https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableSectionElement#Methods} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.insertTBodyRow                = createElement('tbody').insertRow;
        /**
        * Div's [removeAttribute]{https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.removeAttribute               = nativeElement.removeAttribute;
        /**
        * Div's [removeAttributeNS]{https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttributeNS} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.removeAttributeNS             = nativeElement.removeAttributeNS;
        /**
        * Div's [removeChild]{https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.removeChild                   = nativeElement.removeChild;
        /**
        * Div's [setAttribute]{https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.setAttribute                  = nativeElement.setAttribute;
        /**
        * Div's [setAttributeNS]{https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNS} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.setAttributeNS                = nativeElement.setAttributeNS;

        // Event
        /**
        * Div's [addEventListener]{https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.addEventListener          = nativeElement.addEventListener;
        /**
        * Div's [removeEventListener]{https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.removeEventListener       = nativeElement.removeEventListener;
        /**
        * Div's [blur]{https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/blur} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.blur                      = nativeElement.blur;
        /**
        * Div's [click]{https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.click                     = nativeElement.click;
        /**
        * Div's [dispatchEvent]{https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.dispatchEvent             = nativeElement.dispatchEvent;
        /**
        * Div's [attachEvent]{https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/attachEvent} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.attachEvent               = nativeElement.attachEvent;
        /**
        * Div's [detachEvent]{https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/detachEvent} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.detachEvent               = nativeElement.detachEvent;
        /**
        * Div's [fireEvent]{https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/fireEvent} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.fireEvent                 = nativeElement.fireEvent;
        /**
        * Div's [focus]{https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.focus                     = nativeElement.focus;
        /**
        * TextRange's [select]{https://msdn.microsoft.com/en-us/library/ms536735} method in IE.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.select                    = window.TextRange ? createElement('body').createTextRange().select : null;
        /**
        * Input element's [setSelectionRange]{https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange} method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.setSelectionRange         = createElement('input').setSelectionRange;
        /**
        * Text area's **setSelectionRange** method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.textAreaSetSelectionRange = createElement('textarea').setSelectionRange;

        /**
        * Text area's method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.svgFocus = win.SVGElement ? win.SVGElement.prototype.focus : this.focus;
        this.svgBlur  = win.SVGElement ? win.SVGElement.prototype.blur : this.blur;
    }

    /**
    * Refreshes the stored Window methods from the specified Window object.
    * @params {Object} win - the Window object from which methods are copied.
    */
    refreshWindowMeths (win) {
        win = win || window;
        // Dom
        /**
        * Window's [eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/eval) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.eval                    = win.eval;
        /**
        * The [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.EventSource             = win.EventSource;
        /**
        * The [HTMLFormElement.submit](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.formSubmit              = win.HTMLFormElement.prototype.submit;
        /**
        * The [History.pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.historyPushState        = win.history ? win.history.pushState : null;
        /**
        * The [History.replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History#Methods) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.historyReplaceState     = win.history ? win.history.replaceState : null;
        /**
        * The [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.Image                   = win.Image;
        /**
        * The [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.MutationObserver        = win.MutationObserver;
        /**
        * Window's [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.postMessage             = win.postMessage || Window.prototype.postMessage;
        /**
        * The Window's [open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.windowOpen              = win.open || Window.prototype.open;
        /**
        * The [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.Worker                  = win.Worker;
        /**
        * The [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.Blob                    = win.Blob;
        /**
        * Window's [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.setTimeout              = win.setTimeout || Window.prototype.setTimeout;
        /**
        * Window's [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.setInterval             = win.setInterval || Window.prototype.setInterval;
        /**
        * The [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.XMLHttpRequest          = win.XMLHttpRequest;
        /**
        * The [Navigator.registerProtocolHandler](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.registerProtocolHandler = win.navigator.registerProtocolHandler;
        /**
        * The [ServiceWorkerContainer.register](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.registerServiceWorker   = win.navigator &&
                                       win.navigator.serviceWorker ? win.navigator.serviceWorker.register : null;

        // Event
        /**
        * Window's [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.windowAddEventListener    = win.addEventListener || Window.prototype.addEventListener;
        /**
        * Window's [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.windowRemoveEventListener = win.removeEventListener || Window.prototype.removeEventListener;

        // Canvas
        /**
        * The [CanvasRenderingContext2D.drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.canvasContextDrawImage = win.CanvasRenderingContext2D.prototype.drawImage;

        // DateTime
        /**
        * The [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.date    = win.Date;
        /**
        * The [Date.now](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) method.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.dateNow = win.Date.now;

        this.refreshClasses(win);
    }

    /**
    * Refreshes the stored global classes from the specified Window object.
    * @params {Object} win - the Window object from which methods are copied.
    */
    refreshClasses (win) {
        var mock = () => null;

        /**
        * The [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.windowClass   = win.Window || mock;
        /**
        * The [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.documentClass = win.Document || mock;
        /**
        * The [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location) constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.locationClass = win.Location || mock;
        /**
        * The [CSSStyleDeclaration](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration),
        * [CSS2Properties](http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSS2Properties) or **MSStyleCSSProperties** constructor.
        * @type {function}
        * @memberof NativeMethods
        * @instance
        */
        this.styleClass    = win.CSSStyleDeclaration || win.CSS2Properties || win.MSStyleCSSProperties || mock;
    }

    /**
    * Restores the stored Document methods to the specified Document object.
    * @params {Object} document - the Document object to which methods are copied.
    */
    restoreNativeDocumentMeth (document) {
        document.createDocumentFragment = this.createDocumentFragment;
        document.createElement          = this.createElement;
        document.createElementNS        = this.createElementNS;
        document.open                   = this.documentOpen;
        document.close                  = this.documentClose;
        document.write                  = this.documentWrite;
        document.writeln                = this.documentWriteLn;
        document.elementFromPoint       = this.elementFromPoint;
        document.getElementById         = this.getElementById;
        document.getElementsByClassName = this.getElementsByClassName;
        document.getElementsByName      = this.getElementsByName;
        document.getElementsByTagName   = this.getElementsByTagName;
        document.querySelector          = this.querySelector;
        document.querySelectorAll       = this.querySelectorAll;

        // Event
        document.addEventListener    = this.documentAddEventListener;
        document.removeEventListener = this.documentRemoveEventListener;
    }
}

export default new NativeMethods();
