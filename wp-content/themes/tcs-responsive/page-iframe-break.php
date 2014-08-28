<!DOCTYPE html>
<html lang="en">

<head>
<script type="text/javascript">
function getParameterByName(name, source) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(source || location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.onload = function() {
    if (parent) {
        var oHead = document.getElementsByTagName("head")[0];
        var arrStyleSheets = parent.document.getElementsByTagName("link");
        for (var i = 0; i < arrStyleSheets.length; i++)
            oHead.appendChild(arrStyleSheets[i].cloneNode(true));
    }

    document.getElementById('loader').style.display = 'block';
    var loc = getParameterByName('dest') || '/';
	setTimeout(function() {top.window.location = unescape(loc);}, 10000);
}
</script>
</head>
<body>
<div id='loader' class="loading" style="display: none;">Loading...</div>
</body>
</html>