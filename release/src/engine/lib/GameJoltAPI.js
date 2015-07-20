/*

	GameJolt Javascript API by Griffy
	
*/


GJAPI = {
	base_url: "http://gamejolt.com/api/game/v1/",
	game_id: 80361,
	private_key: "9ec94a7ab20a68f6f676a64583c920c1",
	format: "json",
	getURL: function(e, t) {
		t = t || {};
		var n = GJAPI.base_url + e + "/";
		if (Object.keys(t).length > 0) {
			n += "?";
			for (var r in t) {
				if (t.hasOwnProperty(r)) n += r + "=" + t[r] + "&"
			}
		}
		if (n.substr(n.length - 1) != "&") n += "?";
		n += "format=" + GJAPI.format + "&game_id=" + GJAPI.game_id;
		n += "&signature=" + md5(n + GJAPI.private_key);
		return n
	},
	sendURL: function(url, callback) {
		callback = callback || function(e) {};
		var xmlhttp;
		if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest;
		else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				if (GJAPI.format == "json") {
					var d = eval("(" + xmlhttp.responseText + ")").response;
					callback(d)
				} else {
					var d = xmlhttp.responseText;
					callback(d)
				}
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send()
	},
	request: function(e, t, n) {
		if (arguments.length == 2) {
			n = t;
			t = {}
		}
		GJAPI.sendURL(GJAPI.getURL(e, t), n)
	}
};
md5=function(){function n(t){var n,r,i,s,o=[],u=unescape(encodeURI(t)),a=u.length,f=[n=1732584193,r=-271733879,~n,~r],l=0;for(;l<=a;)o[l>>2]|=(u.charCodeAt(l)||128)<<8*(l++%4);o[t=(a+8>>6)*16+14]=a*8;l=0;for(;l<t;l+=16){a=f;s=0;for(;s<64;){a=[i=a[3],(n=a[1]|0)+((i=a[0]+[n&(r=a[2])|~n&i,i&n|~i&r,n^r^i,r^(n|~i)][a=s>>4]+(e[s]+(o[[s,5*s+1,3*s+5,7*s][a]%16+l]|0)))<<(a=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][4*a+s++%4])|i>>>32-a),n,r]}for(s=4;s;)f[--s]=f[s]+a[s]}t="";for(;s<32;)t+=(f[s>>3]>>(1^s++&7)*4&15).toString(16);return t}var e=[],t=0;for(;t<64;){e[t]=0|Math.abs(Math.sin(++t))*4294967296}return n}();
