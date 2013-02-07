/*

Hhhhold - 1.0 - client side image placeholders for hhhhold.com
(c) 2013 Ivan Malopinsky / http://hhhhold.com

I forked this from the amazing repo by:

Holder - 1.9 - client side image placeholders
(c) 2012-2013 Ivan Malopinsky / http://imsky.co

Provided under the Apache 2.0 License: http://www.apache.org/licenses/LICENSE-2.0
Commercial use requires attribution.

*/

var Hhhhold = Hhhhold || {};
(function (app, win) {

var preempted = false,
fallback = false,
canvas = document.createElement('canvas');

//getElementsByClassName polyfill
document.getElementsByClassName||(document.getElementsByClassName=function(e){var t=document,n,r,i,s=[];if(t.querySelectorAll)return t.querySelectorAll("."+e);if(t.evaluate){r=".//*[contains(concat(' ', @class, ' '), ' "+e+" ')]",n=t.evaluate(r,t,null,0,null);while(i=n.iterateNext())s.push(i)}else{n=t.getElementsByTagName("*"),r=new RegExp("(^|\\s)"+e+"(\\s|$)");for(i=0;i<n.length;i++)r.test(n[i].className)&&s.push(n[i])}return s})

//getComputedStyle polyfill
window.getComputedStyle||(window.getComputedStyle=function(e,t){return this.el=e,this.getPropertyValue=function(t){var n=/(\-([a-z]){1})/g;return t=="float"&&(t="styleFloat"),n.test(t)&&(t=t.replace(n,function(){return arguments[2].toUpperCase()})),e.currentStyle[t]?e.currentStyle[t]:null},this})

//http://javascript.nwbox.com/ContentLoaded by Diego Perini with modifications
function contentLoaded(n,t){var l="complete",s="readystatechange",u=!1,h=u,c=!0,i=n.document,a=i.documentElement,e=i.addEventListener?"addEventListener":"attachEvent",v=i.addEventListener?"removeEventListener":"detachEvent",f=i.addEventListener?"":"on",r=function(e){(e.type!=s||i.readyState==l)&&((e.type=="load"?n:i)[v](f+e.type,r,u),!h&&(h=!0)&&t.call(n,null))},o=function(){try{a.doScroll("left")}catch(n){setTimeout(o,50);return}r("poll")};if(i.readyState==l)t.call(n,"lazy");else{if(i.createEventObject&&a.doScroll){try{c=!n.frameElement}catch(y){}c&&o()}i[e](f+"DOMContentLoaded",r,u),i[e](f+s,r,u),n[e](f+"load",r,u)}};

//https://gist.github.com/991057 by Jed Schmidt with modifications
function selector(a){
	a=a.match(/^(\W)?(.*)/);var b=document["getElement"+(a[1]?a[1]=="#"?"ById":"sByClassName":"sByTagName")](a[2]);
	var ret=[];	b!=null&&(b.length?ret=b:b.length==0?ret=b:ret=[b]);	return ret;
}

//shallow object property extend
function extend(a,b){var c={};for(var d in a)c[d]=a[d];for(var e in b)c[e]=b[e];return c}

//hasOwnProperty polyfill
if (!Object.prototype.hasOwnProperty)
	Object.prototype.hasOwnProperty = function(prop) {
		var proto = this.__proto__ || this.constructor.prototype;
		return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
	}

function render(mode, el, holder, src) {
	var dimensions = holder.dimensions,
		theme = holder.theme,
		text = holder.text ? decodeURIComponent(holder.text) : holder.text;
	var dimensions_caption = dimensions.width + "x" + dimensions.height;
		
	theme = (text ? extend(theme, {
		text: text
	}) : theme);
	theme = (holder.font ? extend(theme, {
		font: holder.font
	}) : theme);

	if (mode == "image") {
		el.setAttribute("data-src", src);
		el.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);

		if (fallback || !holder.auto) {
			el.style.width = dimensions.width + "px";
			el.style.height = dimensions.height + "px";
		}

		if (fallback) {
			el.style.backgroundImage = "url(" + "http://hhhhold.com/" + dimensions.width + 'x' + dimensions.height + '/' + holder.url + '?' + Math.random() + ")";
			el.style.backgroundSize = dimensions.width + "px " + dimensions.height + "px";

		} else {
			el.setAttribute("src", "http://hhhhold.com/" + dimensions.width + 'x' + dimensions.height + '/' + holder.url + '?' + Math.random());
		}
	} else {
		if (!fallback) {
			el.style.backgroundImage = "url(" + "http://localhost:32442/" + dimensions.width + 'x' + dimensions.height + '/' + holder.url + '?' + Math.random() + ")";
			el.style.backgroundSize = dimensions.width + "px " + dimensions.height + "px";
		}
	}
};


function parse_flags(flags, options) {

	var ret = {
		theme: settings.themes.gray
	}, render = false;

	for (sl = flags.length, j = 0; j < sl; j++) {
		var flag = flags[j];
		if (app.flags.dimensions.match(flag) && !ret.dimensions) {
			render = true;
			ret.dimensions = app.flags.dimensions.output(flag);
		} else if (app.flags.singleDimension.match(flag) && !ret.dimensions) {
			render = true;
			ret.dimensions = app.flags.singleDimension.output(flag);
		} else if (app.flags.small.match(flag) && !ret.dimensions) {
			render = true;
			ret.dimensions = app.flags.small.output(flag);
		} else if (app.flags.medium.match(flag) && !ret.dimensions) {
			render = true;
			ret.dimensions = app.flags.medium.output(flag);
		} else if (app.flags.large.match(flag) && !ret.dimensions) {
			render = true;
			ret.dimensions = app.flags.large.output(flag);
		} else if (app.flags.extraLarge.match(flag) && !ret.dimensions) {
			render = true;
			ret.dimensions = app.flags.extraLarge.output(flag);
		} else if (app.flags.random.match(flag) && !ret.dimensions) {
			render = true;
			ret.dimensions = app.flags.random.output(flag);
		}
	}

	if (!ret.dimensions) {
		render = true;
		ret.dimensions = app.flags.random.output(flag);
	}

	for (sl = flags.length, j = 0; j < sl; j++) {
		var flag = flags[j];
		if (app.flags.wide.match(flag)) {
			ret.dimensions = app.flags.wide.output(flag, ret.dimensions);
		} else if (app.flags.tall.match(flag)) {
			ret.dimensions = app.flags.tall.output(flag, ret.dimensions);
		}
	}

	return render ? ret : false;

};



if (!canvas.getContext) {
	fallback = true;
} else {
	if (canvas.toDataURL("image/png")
		.indexOf("data:image/png") < 0) {
		//Android doesn't support data URI
		fallback = true;
	} else {
		var ctx = canvas.getContext("2d");
	}
}

var dpr = 1, bsr = 1;
	
if(!fallback){
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
}

var ratio = dpr / bsr;

var fluid_images = [];

var settings = {
	domain: "hhhhold.js",
	images: "img",
	bgnodes: ".hhhholdjs",
	themes: {
		"gray": {
			background: "#eee",
			foreground: "#aaa",
			size: 12
		},
		"social": {
			background: "#3a5a97",
			foreground: "#fff",
			size: 12
		},
		"industrial": {
			background: "#434A52",
			foreground: "#C2F200",
			size: 12
		}
	},
	stylesheet: ".hhhholdjs-fluid {font-size:16px;font-weight:bold;text-align:center;font-family:sans-serif;margin:0}"
};


app.flags = {
	dimensions: {
		regex: /^(\d+)x(\d+)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: +exec[1],
				height: +exec[2]
			}
		}
	},
	singleDimension: {
		regex: /^(\d+)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: +exec[1],
				height: +exec[1]
			}
		}
	},
	small: {
		regex: /^(s)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: Math.floor(Math.random() * (250 - 100 + 1)) + 100,
				height: Math.floor(Math.random() * (250 - 100 + 1)) + 100
			}
		}
	},
	medium: {
		regex: /^(m)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: Math.floor(Math.random() * (500 - 250 + 1)) + 250,
				height: Math.floor(Math.random() * (500 - 250 + 1)) + 250
			}
		}
	},
	large: {
		regex: /^(l)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: Math.floor(Math.random() * (900 - 500 + 1)) + 500,
				height: Math.floor(Math.random() * (900 - 500 + 1)) + 500
			}
		}
	},
	extraLarge: {
		regex: /^(xl)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: Math.floor(Math.random() * (1280 - 900 + 1)) + 900,
				height: Math.floor(Math.random() * (1280 - 900 + 1)) + 900
			}
		}
	},
	random: {
		regex: /^(r)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: Math.floor(Math.random() * (1280 - 100 + 1)) + 100,
				height: Math.floor(Math.random() * (1280 - 100 + 1)) + 100
			}
		}
	},
	wide: {
		regex: /^(w)$/,
		output: function (val, dim) {
			var exec = this.regex.exec(val);
			return {
				width: dim.width,
				height: Math.round(dim.width / (Math.random()*2+1.3))
			}
		}
	},
	tall: {
		regex: /^(t)$/,
		output: function (val, dim) {
			var exec = this.regex.exec(val);
			return {
				width: Math.round(dim.width * (Math.random()/2 + .3)),
				height: dim.height
			}
		}
	},
	fluid: {
		regex: /^([0-9%]+)x([0-9%]+)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: exec[1],
				height: exec[2]
			}
		}
	}
}

for (var flag in app.flags) {
	if (!app.flags.hasOwnProperty(flag)) continue;
	app.flags[flag].match = function (val) {
		return val.match(this.regex)
	}
}

app.add_theme = function (name, theme) {
	name != null && theme != null && (settings.themes[name] = theme);
	return app;
};

app.add_image = function (src, el) {
	var node = selector(el);
	if (node.length) {
		for (var i = 0, l = node.length; i < l; i++) {
			var img = document.createElement("img")
			img.setAttribute("data-src", src);
			node[i].appendChild(img);
		}
	}
	return app;
};

app.run = function (o) {
	var options = extend(settings, o),
	    images = [], imageNodes = [], bgnodes = [];
	    
	if(typeof(options.images) == "string"){
	    imageNodes = selector(options.images);
	}
	else if (window.NodeList && options.images instanceof window.NodeList) {
		imageNodes = options.images;
	} else if (window.Node && options.images instanceof window.Node) {
		imageNodes = [options.images];
	}

	if(typeof(options.bgnodes) == "string"){
	    bgnodes = selector(options.bgnodes);
	} else	if (window.NodeList && options.elements instanceof window.NodeList) {
		bgnodes = options.bgnodes;
	} else if (window.Node && options.bgnodes instanceof window.Node) {
		bgnodes = [options.bgnodes];
	}

	preempted = true;

	for (i = 0, l = imageNodes.length; i < l; i++) images.push(imageNodes[i]);

	var holdercss = document.getElementById("hhhholdjs-style");
	if (!holdercss) {
		holdercss = document.createElement("style");
		holdercss.setAttribute("id", "hhhholdjs-style");
		holdercss.type = "text/css";
		document.getElementsByTagName("head")[0].appendChild(holdercss);
	}
	
	if (!options.nocss) {
	    if (holdercss.styleSheet) {
		    holdercss.styleSheet.cssText += options.stylesheet;
	    } else {
		    holdercss.appendChild(document.createTextNode(options.stylesheet));
	    }
	}

	

	var cssregex = new RegExp(options.domain + "\/(.*?)\"?\\)");

	for (var l = bgnodes.length, i = 0; i < l; i++) {
		var src = window.getComputedStyle(bgnodes[i], null)
			.getPropertyValue("background-image");
		var flags = src.match(cssregex);
		if (flags) {
			var holder = parse_flags(flags[1].split("/"), options);
			if (holder) {
				render("background", bgnodes[i], holder, src);
			}
		}
	}

	for (l = images.length, i = 0; i < l; i++) {
	    
		var attr_src = attr_data_src = src = null;
		
		try{
		    attr_src = images[i].getAttribute("src");
		    attr_datasrc = images[i].getAttribute("data-src");
		}catch(e){}
				
		if (attr_datasrc == null && !! attr_src && attr_src.indexOf(options.domain) >= 0) {
			src = attr_src;
		} else if ( !! attr_datasrc && attr_datasrc.indexOf(options.domain) >= 0) {
			src = attr_datasrc;
		}
		
		if (src) {
			var holder = parse_flags(src.substr(src.lastIndexOf(options.domain) + options.domain.length + 1)
				.split("/"), options);
			if (holder) {
				holder.url = src.split('hhhhold.js/')[1]
				if (holder.fluid) {
					fluid(images[i], holder, src);
				} else {
					render("image", images[i], holder, src);
				}
			}
		}
	}
	return app;
};

contentLoaded(win, function () {
	preempted || app.run();
});

if (typeof define === "function" && define.amd) {
	define("Hhhhold", [], function () {
		return app;
	});
}

})(Hhhhold, window);
