<script>
function getParameterByName(name, source) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(source || location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var loc = getParameterByName('dest') || '/';
top.window.location = unescape(loc);
</script>