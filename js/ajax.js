/**
 * Makes http request to specified url and calls callback function.
 * @param method - GET or POST
 * @param url - url to request
 * @param callback - function(resultStr)
 */
function ajaxRequest(method, url, callback) {
    var request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) {
                callback(request.responseText);
                return;
            }
            else callback("")
        } else callback("")
    };
    request.open(method, url, true);
    request.send();
}