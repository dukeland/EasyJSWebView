window.EasyJS = {
	
	call: function (obj, functionName, args){
		var formattedArgs = [];
		for (var i = 0, l = args.length; i < l; i++){
			formattedArgs.push(encodeURIComponent(args[i]));
		}
		
		var argStr = (formattedArgs.length > 0 ? ":" + encodeURIComponent(formattedArgs.join(":")) : "");
		
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", "easy-js:" + obj + ":" + encodeURIComponent(functionName) + argStr);
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
		
		var ret = EasyJS.retValue;
		EasyJS.retValue = undefined;
		
		if (ret){
			return decodeURIComponent(ret);
		}
	},
	
	inject: function (obj, methods){
		window[obj] = {};
		var jsObj = window[obj];
		
		for (var i = 0, l = methods.length; i < l; i++){
			(function (){
				var method = methods[i];
				var jsMethod = method.replace(new RegExp(":", "g"), "");
				jsObj[jsMethod] = function (){
					return EasyJS.call(obj, method, Array.prototype.slice.call(arguments));
				};
			})();
		}
	}
};