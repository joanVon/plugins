//iosAlert.js
(function ($) {
	var totalID = 0;
	var thisID = 0;
	var autocloseto = setTimeout(function(){
	}, 0);
	var iosAlert_function = function(opt){
		var _def = {
			title : "",
			content : "",
			addClass : "",
			type : 0,
			html : false,
			sound : "",
			autoClose : 0,
			pressKeys : true,
			buttonText : {
				Yes : "确定",
				Delete : "删除",
				No : "取消"
			},
			onClickYes : "",
			onClickNo : "",
			onClose : ""
		}
		var _opt = $.extend(true, _def, opt);
		var stringtohtml = function(str) { 
			str = str.replace(/&/g, "&amp;");
			str = str.replace(/</g, "&lt;");
			str = str.replace(/>/g, "&gt;");
			str = str.replace(/"/g, "&quot;");
			str = str.replace(/\n/g, "<br>");
			str = str.replace(/\r/g, "<br>");
			return str;
		}
		if(_opt.html != true){
			_opt.title = stringtohtml(_opt.title);
			_opt.content = stringtohtml(_opt.content);
		}
		var bgElement = "<div class=\"iosAlert_bg\" unselectable=\"on\" onselectstart=\"return false;\"></div>";
		var popupElement = "<div class=\"iosAlert\" unselectable=\"on\" onselectstart=\"return false;\"><div class=\"side_top\"><div class=\"alt_titlebar\">" + _opt.title + "</div></div><div class=\"alt_bg\"><div class=\"alt_content\">" + _opt.content + "</div></div><div class=\"side_bottom\"></div></div>";
		var yesButton = "<div class=\"alt_button\"><div class=\"alt_button_side_left\"></div><div class=\"alt_button_bg\">" + _opt.buttonText.Yes +"</div><div class=\"alt_button_side_right\"></div></div>";
		var noButton = "<div class=\"alt_button alt_button_def\"><div class=\"alt_button_side_left\"></div><div class=\"alt_button_bg\">" + _opt.buttonText.No +"</div><div class=\"alt_button_side_right\"></div></div>";
		var delButton = "<div class=\"alt_button alt_button_del\"><div class=\"alt_button_side_left\"></div><div class=\"alt_button_bg\">" + _opt.buttonText.Delete +"</div><div class=\"alt_button_side_right\"></div></div>";
		if(_opt.sound != ""){
			_opt.sound = "<audio id=\"alertsound\" autoplay=\"autoplay\" src=\"" + _opt.sound + "\"></audio>";
		}
		var popup = function(){
			$('.iosAlert').remove();
			$(".iosAlert_bg").remove();
			$("#alertsound").remove();
			$("body").append(bgElement, popupElement, _opt.sound);
			$(".page-content").css("-webkit-overflow-scrolling","auto");
			$(window).resize(function(){
				$('.iosAlert').css({
					position:'absolute',
					top: ($(window).height() - $('.iosAlert').height()) / 2
				});
			});
			$(window).resize();
			if(_opt.addClass != ""){
				$('.iosAlert').addClass(_opt.addClass);
			}
			$('.iosAlert').addClass("iosAlertpopup");
			setTimeout(function(){
				$('.iosAlert').removeClass("iosAlertpopup");
			}, 500);
			$(".iosAlert_bg").addClass("iosAlertbgpop");
			setTimeout(function(){
				$(".iosAlert_bg").removeClass("iosAlertbgpop");
			}, 900);
			if(_opt.title == ""){
				$(".iosAlert .alt_bg").css("padding-top", "0px");
				$(".iosAlert .alt_content").css("padding-top", "0px");
			}
			switch(_opt.type){
				case 1:
					$(".iosAlert .alt_bg").append(noButton);
					$(".iosAlert .alt_bg").append(yesButton);
				break;
				case 2:
					$(".iosAlert .alt_bg").append(noButton);
					$(".iosAlert .alt_bg").append(delButton);
					
				break;
				default:
					$(".iosAlert .alt_bg").append(yesButton);
					$(".iosAlert .alt_button").addClass("alt_button_single");
					_opt.onClickNo = _opt.onClickYes;
				break;
			}
			if(_opt.sound != ""){
				document.getElementById("alertsound").onended = function(){
					$("#alertsound").remove();
				}
			}
			$(".iosAlert .alt_button, .iosAlert .alt_button_del").not(".iosAlert .alt_button_def").click(function(){
				closepop();
				if(typeof _opt.onClickYes == "function"){
					_opt.onClickYes();
				}
			});
			$(document).keydown(function(event){
				if(_opt.pressKeys == true && _opt.type == 1 || _opt.pressKeys == true && _opt.type == 2){
					if(event.keyCode == 13 || event.keyCode == 32 || event.keyCode == 89){
						closepop();
						if(typeof _opt.onClickYes == "function"){
							_opt.onClickYes();
						}
					}
					if(event.keyCode == 78 || event.keyCode == 27){
						closepop();
						if(typeof _opt.onClickNo == "function"){
							_opt.onClickNo();
						}
					}
				}
				else if(_opt.pressKeys == true){
					if(event.keyCode == 13 || event.keyCode == 32 || event.keyCode == 89 || event.keyCode == 27){
						closepop();
						if(typeof _opt.onClickYes == "function"){
							_opt.onClickYes();
						}
					}
				}
			});
			$(".iosAlert .alt_button_def").click(function(){
				closepop();
				if(typeof _opt.onClickNo == "function"){
					_opt.onClickNo();
				}
			});
			if(_opt.autoClose > 0){
				autocloseto = setTimeout(function(){
					closepop();
					if(typeof _opt.onClickNo == "function"){
						_opt.onClickNo();
					}
				}, _opt.autoClose);
			}
		}
		var closepop = function(){
			$('.iosAlert').addClass("iosAlertclose");
			$(".iosAlert_bg").addClass("iosAlertbgclose");
			$(document).unbind("keydown");
			autocloseto && clearTimeout(autocloseto);
			setTimeout(function(){
				if(typeof _opt.onClose == "function"){
					_opt.onClose();
				}
				$('.iosAlert').remove();
				$(".iosAlert_bg").remove();
				$(".page-content").css("-webkit-overflow-scrolling","touch");
				totalID ++;
			}, 150);
		}
		popup();
	}
	$.fn.iosAlert = function(opt){
		var popupf = function(ID){
			var int = setInterval(function(){
				if(ID == totalID){
					clearInterval(int);
					iosAlert_function(opt);
				}
			}, 100);
			if(ID == totalID){
				clearInterval(int);
				iosAlert_function(opt);
			}
		}
		popupf(thisID);
		thisID ++;
	}
})(Zepto);