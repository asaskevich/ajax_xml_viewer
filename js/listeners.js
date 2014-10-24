/**
 * onClick listener.
 * Makes request after clicking on button.
 */
function onGETButtonClick() {
    var url = document.getElementById("path").value;
    ajaxRequest("GET", url, parseXml)
}

/**
 * Toggles informational panel
 */
function toggleXMLPanel() {
    var panel = document.getElementById("xml_panel");
    // Don't open empty panels
    if (panel.innerHTML.length <= 0) return;
    if (panel.style.display === "none") panel.style.display = "";
    else panel.style.display = "none";
}

/**
 * Toggles errors panel
 */
function toggleErrorsPanel() {
    var panel = document.getElementById("errors_panel");
    // Don't open empty panels
    if (panel.innerHTML.length <= 0) return;
    if (panel.style.display === "none") panel.style.display = "";
    else panel.style.display = "none";
}

/**
 * Toggles warnings panel
 */
function toggleWarningsPanel() {
    var panel = document.getElementById("warnings_panel");
    // Don't open empty panels
    if (panel.innerHTML.length <= 0) return;
    if (panel.style.display === "none") panel.style.display = "";
    else panel.style.display = "none";
}

/**
 * Applies drag listener to elementId
 * @param elementId
 */
function initDragListener(elementId) {
    var element = document.getElementById(elementId);
    var offset = {x: 0, y: 0};

    function addListeners() {
        document.getElementById(elementId).addEventListener('mousedown', mouseDown, false);
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
            var div = document.getElementById('tooltip');
            div.style.position = 'absolute';
            div.style.top = event.clientY - offset.y + 'px';
            div.style.left = event.clientX - offset.x + 'px';
        }
    }

    addListeners();
}