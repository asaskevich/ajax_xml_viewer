/**
 * Creates new button with onClick listener with specified caption
 * @param caption
 * @returns {HTMLElement} new button as DOM element
 */
function getGetButton(caption) {
    var button = document.createElement("button");
    button.innerHTML = caption;
    button.id = "button_get";
    button.setAttribute("onclick", "onGETButtonClick()");
    return button;
}

/**
 * Creates new button with onClick listener with specified caption
 * @param caption
 * @returns {HTMLElement} new button as DOM element
 */
function getPostButton(caption) {
    var button = document.createElement("button");
    button.innerHTML = caption;
    button.id = "button_post";
    button.setAttribute("onclick", "onPOSTButtonClick()");
    return button;
}

/**
 * Creates new tab button
 * Used for creating tab buttons like "XMl(0 bytes)" etc
 * @param tabId
 * @param tabToggle - toggle listener
 * @param caption
 * @returns {HTMLElement}
 */
function getTabButton(tabId, tabToggle, caption) {
    var tab = document.createElement("a");
    tab.innerHTML = caption;
    tab.id = tabId;
    tab.setAttribute("onclick", tabToggle);
    tab.setAttribute("href", "#");
    return tab;
}

/**
 * Creates tab buttons that expand panels
 * @returns {HTMLElement}
 */
function getTabs() {
    var tab = document.createElement("div");
    tab.innerHTML = "Views: ";
    var xmlTab = getTabButton("xml_tab", "toggleXMLPanel()", "XML (0 bytes)");
    var errorsTab = getTabButton("errors_tab", "toggleErrorsPanel()", "Errors (0)");
    var warningsTab = getTabButton("warnings_tab", "toggleWarningsPanel()", "Warnings (0)");
    tab.appendChild(xmlTab);
    tab.appendChild(document.createTextNode(" | "));
    tab.appendChild(errorsTab);
    tab.appendChild(document.createTextNode(" | "));
    tab.appendChild(warningsTab);
    return tab;
}

/**
 * Creates status label
 * @returns {HTMLElement}
 */
function getStatusTab() {
    var statusTab = document.createElement("div");
    statusTab.innerHTML = "Status: READY";
    statusTab.id = "status_tab";
    return statusTab;
}

/**
 * Creates draggable title
 * @returns {HTMLElement}
 */
function getTitle() {
    var title = document.createElement("div");
    title.id = "title";
    title.innerHTML = "AJAX XML Viewer";
    return title;
}

/**
 * Creates new panel
 * @param panelId - id of panel
 * @param tag - tag, used for creating tab. By default = div
 * @returns {HTMLElement}
 */
function getPanel(panelId, tag) {
    tag = tag || "div";
    var panel = document.createElement(tag);
    panel.style.display = "none";
    panel.id = panelId;
    panel.className = "panel";
    panel.innerHTML = "";
    panel.style.overflow = "auto";
    panel.style.maxHeight = (window.innerHeight / 2) + "px";
    panel.style.maxWidth = (window.innerWidth / 2) + "px";
    return panel;
}

/**
 * Initializes new GUI - creates div's, elements, etc.
 */
function initGUI() {
    window.onload = function () {
        var tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.id = "tooltip";
        var input = document.createElement("input");
        input.id = "path";
        input.setAttribute("placeholder", "file.xml");
        var infoPanel = getPanel("xml_panel", "pre");
        var errorsPanel = getPanel("errors_panel");
        var warningsPanel = getPanel("warnings_panel");
        tooltip.appendChild(getTitle());
        tooltip.appendChild(input);
        tooltip.appendChild(getGetButton("GET"));
        tooltip.appendChild(getPostButton("POST"));
        tooltip.appendChild(getTabs());
        tooltip.appendChild(getStatusTab());
        tooltip.appendChild(infoPanel);
        tooltip.appendChild(errorsPanel);
        tooltip.appendChild(warningsPanel);
        document.body.appendChild(tooltip);
        initDragListener("tooltip", "title");
    };
}