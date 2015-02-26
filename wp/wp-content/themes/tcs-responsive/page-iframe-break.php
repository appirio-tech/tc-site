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

    parent.document.getElementsByClassName('termsFrame')[0].style.height = '150px';

    document.getElementById('loader').style.display = 'block';
    var loc = getParameterByName('dest') || '/';
	setTimeout(function() {top.window.location = unescape(loc);}, 21000);
}
</script>
</head>
<body>
<div id='loader' class='loading' style='display: none;'>Loading...</div>
<p class='text-center' style='margin: 80px 10% 0 10%;'>It may take up to a minute for your agreement to be authorized. If you choose to go back to the terms acceptance page before the authorization is complete, the status may remain unchanged until the process is finished.</p>
</body>
</html>