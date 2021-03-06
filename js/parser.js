/**
 * Parses string as xml document and returns DOM tree of elements
 * @param xmlString - string to being parsed as xml
 * @returns {*}
 */
function getXMLDocument(xmlString) {
    try {
        var parser;
        if (typeof window.DOMParser != "undefined") {
            parser = function (xmlStr) {
                var p = new window.DOMParser();
                return p.parseFromString(xmlStr, "text/xml");
            };
        } else if (typeof window.ActiveXObject != "undefined" &&
            new window.ActiveXObject("Microsoft.XMLDOM")) {
            parser = function (xmlStr) {
                var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xmlStr);
                return xmlDoc;
            };
        } else {
            throw new Error("No XML parser found");
        }
        return parser(xmlString);
    } catch (e) {
        return getXMLDocument('<parsererror />');
    }
}

/**
 * Checks that xml document has valid structure
 * @param xmlDoc
 * @returns {boolean} true if document has valid structure, false otherwise
 */
function isValidXMLDoc(xmlDoc) {
    var xml;
    try {
        xml = getXMLDocument("<");
        var parserErrorNS = xml.getElementsByTagName("parsererror")[0].namespaceURI;
        return xmlDoc.getElementsByTagNameNS(parserErrorNS, 'parsererror').length == 0;
    } catch (e) {
        // IE throws SyntaxError
        return xmlDoc.getElementsByTagName("parsererror").length == 0;
    }
}

/**
 * Removes all elements with specified tags from document
 * @param xmlDocument
 * @param tag
 */
function removeTags(xmlDocument, tag) {
    var tags = xmlDocument.getElementsByTagName(tag),
        i = tags.length;
    while (i) {
        i -= 1;
        tags[i].parentNode.removeChild(tags[i]);
    }
}

/**
 * Returns string equivalent of document
 * @param xml
 * @returns {string}
 */
function getXMLAsString(xml) {
    if (window.ActiveXObject) return xml.xml;
    else return (new XMLSerializer()).serializeToString(xml);
}

/**
 * Extracts error tags from xml document
 * @param xmlDoc
 */
function extractErrors(xmlDoc) {
    var tags = xmlDoc.getElementsByTagName("error"),
        i = tags.length,
        panel = document.getElementById("errors_panel");
    panel.innerHTML = "";
    var ul = panel.appendChild(document.createElement("ol"));
    while (i) {
        i -= 1;
        var text = tags[i].getAttribute("text");
        var code = tags[i].getAttribute("code");
        var item = document.createElement("li");
        var boldCode = document.createElement("b");
        boldCode.innerHTML = "Code " + code + ": ";
        var error = document.createTextNode(text);
        item.appendChild(boldCode);
        item.appendChild(error);
        ul.appendChild(item);
    }
}

/**
 * Extracts warnings tags from xml document
 * @param xmlDoc
 */
function extractWarnings(xmlDoc) {
    var tags = xmlDoc.getElementsByTagName("warning"),
        i = tags.length,
        panel = document.getElementById("warnings_panel");
    panel.innerHTML = "";
    var ul = panel.appendChild(document.createElement("ol"));
    while (i) {
        i -= 1;
        var text = tags[i].getAttribute("text");
        var item = document.createElement("li");
        var error = document.createTextNode(text);
        item.appendChild(error);
        ul.appendChild(item);
    }
}

/**
 * Escapes html entities in string
 * @param string
 * @returns {string}
 */
function escapeXML(string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

/**
 * Parses xml string into document, extracts errors and warnings etc
 * @param xmlString
 * @param status
 */
function parseXml(xmlString, status) {
    var xml = getXMLDocument(xmlString);
    var xmlTab = document.getElementById("xml_tab");
    xmlTab.innerHTML = "XML (" + xmlString.length + " bytes)";
    var statusTab = document.getElementById("status_tab");
    var errorCount = xml.getElementsByTagName("error").length;
    var errorsTab = document.getElementById("errors_tab");
    var warningCount = xml.getElementsByTagName("warning").length;
    var warningTab = document.getElementById("warnings_tab");
    errorsTab.innerHTML = "Errors (" + errorCount + ")";
    warningTab.innerHTML = "Warnings (" + warningCount + ")";
    statusTab.innerHTML = "Status: " + (isValidXMLDoc(xml) ? "OK" : "INCORRECT DATA");
    if (isValidXMLDoc(xml)) {
        extractErrors(xml);
        extractWarnings(xml);
        removeTags(xml, "error");
        removeTags(xml, "warning");
        var panel = document.getElementById("xml_panel");
        panel.innerHTML = highlightXml(xml.childNodes, "");
    } else {
        document.getElementById("xml_panel").innerHTML = "";
        document.getElementById("errors_panel").innerHTML = "";
        document.getElementById("warnings_panel").innerHTML = "";
        hideAllPanels();
        errorsTab.innerHTML = "Errors (0)";
        warningTab.innerHTML = "Warnings (0)";
        xmlTab.innerHTML = "XML (0 bytes)";
    }
}

/**
 * Wraps element with span and returns string equivalent
 * @param value
 * @param span_class
 * @returns {string}
 */
function wrap(value, span_class) {
    return "<span class='" + span_class + "'>" + escapeXML(value) + "</span>";
}

/**
 * Returns node as spanned string
 * @param node
 * @returns {string}
 */
function getNodeAsText(node) {
    var result = wrap(node.nodeName, "tag_name") + (node.attributes.length > 0 ? " " : "");
    var attrs = node.attributes;
    for (var i = 0; i < attrs.length; i++) {
        result += wrap(attrs[i].nodeName, "attr_name");
        result += '=';
        result += wrap('"' + node.getAttribute(attrs[i].nodeName) + '"', "attr_value");
        if (i !== attrs.length - 1) result += " ";
    }
    return result;
}

/**
 * Highlights nodes and returns string equivalent
 * @param nodes
 * @param offset
 * @returns {string}
 */
function highlightXml(nodes, offset) {
    offset = offset || "";
    var result = "";
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].hasChildNodes()) {
            result += offset + "&lt;" + getNodeAsText(nodes[i]) + "&gt;\n";
            result += highlightXml(nodes[i].childNodes, offset + "&nbsp;&nbsp;");
            result += offset + "&lt;/" + wrap(nodes[i].nodeName, "tag_name") + "&gt;\n";
        } else if (nodes[i].nodeName !== "#text" && nodes[i].nodeName !== "#comment" ) {
            result += offset + "&lt;" + getNodeAsText(nodes[i]) + "/&gt;\n";
        } else if (nodes[i].nodeName === "#comment") {
            result += offset + wrap("<!-- " + nodes[i].nodeValue + " -->", "comment") + "\n";
        } else if (!(!nodes[i].nodeValue || /^\s*$/.test(nodes[i].nodeValue))) {
            result += offset + wrap(nodes[i].nodeValue, "text_node") + "\n";
        }
    }
    return result;
}