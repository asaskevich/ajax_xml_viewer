/**
 * onClick listener.
 * Makes GET request after clicking on button.
 */
function onGETButtonClick() {
    var url = document.getElementById("path").value;
    ajaxRequest("GET", url, parseXml)
}

/**
 * onClick listener.
 * Makes POST request after clicking on button.
 */
function onPOSTButtonClick() {
    var url = document.getElementById("path").value;
    ajaxRequest("POST", url, parseXml)
}

/**
 * Hide all panels, but leaves panel leavePanel opened/hidden
 * @param leavePanel
 */
function hideAllPanels(leavePanel) {
    if (leavePanel !== "xml") {
        document.getElementById("xml_panel").style.display = "none";
        document.getElementById("xml_tab").className = "";
    }
    if (leavePanel !== "errors") {
        document.getElementById("errors_panel").style.display = "none";
        document.getElementById("errors_tab").className = "";
    }
    if (leavePanel !== "warnings") {
        document.getElementById("warnings_panel").style.display = "none";
        document.getElementById("warnings_tab").className = "";
    }
}

/**
 * Toggles informational panel
 */
function toggleXMLPanel() {
    hideAllPanels("xml");
    var panel = document.getElementById("xml_panel");
    var tab = document.getElementById("xml_tab");
    // Don't open empty panels
    if (panel.innerHTML.length <= 0) return;
    if (panel.style.display === "none") {
        panel.style.display = "";
        tab.className = "active_tab";
    } else {
        panel.style.display = "none";
        tab.className = "";
    }
}

/**
 * Toggles errors panel
 */
function toggleErrorsPanel() {
    hideAllPanels("errors");
    var panel = document.getElementById("errors_panel");
    var tab = document.getElementById("errors_tab");
    // Don't open empty panels
    if (panel.innerHTML.length <= 0) return;
    if (panel.style.display === "none") {
        panel.style.display = "";
        tab.className = "active_tab";
    } else {
        panel.style.display = "none";
        tab.className = "";
    }
}

/**
 * Toggles warnings panel
 */
function toggleWarningsPanel() {
    hideAllPanels("warnings");
    var panel = document.getElementById("warnings_panel");
    var tab = document.getElementById("warnings_tab");
    // Don't open empty panels
    if (panel.innerHTML.length <= 0) return;
    if (panel.style.display === "none") {
        panel.style.display = "";
        tab.className = "active_tab";
    } else {
        panel.style.display = "none";
        tab.className = "";
    }
}

/**
 * Applies drag listener to elementId's titleId
 * @param elementId
 * @param titleId
 */
function initDragListener(elementId, titleId) {
    var element = document.getElementById(elementId);
    var title = document.getElementById(titleId);
    var offset = {x: 0, y: 0};

    function addListeners() {
        title.addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);
    }

    function mouseUp() {
        window.removeEventListener('mousemove', elementMove, true);
    }

    function mouseDown(event) {
        offset.x = event.clientX - element.style.left.replace('px', '');
        offset.y = event.clientY - element.style.top.replace('px', '');
        window.addEventListener('mousemove', elementMove, true);
    }

    function elementMove(event) {
        // Do not drag when current active element is input or button
        if ((document.activeElement !== document.getElementById("path")) &&
            (document.activeElement !== document.getElementById("button_get"))) {
            element.style.position = 'absolute';
            element.style.top = event.clientY - offset.y + 'px';
            element.style.left = event.clientX - offset.x + 'px';
        }
    }

    addListeners();
}