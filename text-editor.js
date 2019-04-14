"use strict";

document.getElementById("hnid-content").spellcheck = false;
document.getElementById("hnid-content").focus();
document.getElementById("hnid-content").blur();




$(document).ready(function(){
	var KEYNAME = {
		ENTER: 13
	}

	var align = "left";
	var inOrderedList = false;

	function HnidCore(){
		this.ExecCommand = function(command,value){
			if(typeof value === "undefined"){
				document.execCommand(command);
				return;
			}
			document.execCommand(command,value);
		}
	}
	function HnidUI(){

		this.super_ = HnidCore;
		this.super_.call(this);

		this.hnidTextField = $("#hnid-content");
		this.txtFormatBtn = $(".txt-fm-cop-btn");
		this.fontClrPicker = $("#fontClrPicker");
		this.fontBackClrPicker = $("#fontbackClrPicker");
		this.fontFamilySelect = $("#txt-fm-sl-f-family");
		this.fontSizeSelect = $("#txt-fm-sl-f-size");
		this.orderListBtn = $(".fm-order-l-btn");

		var that = this;

		this.blockQuote = function(){
			this._quoteBtn = $("#hnid-quote-ge");
		}

		this.blockQuote .prototype.Init = function(){
			$(this._quoteBtn).on('click',function(e){
				let selection = document.getSelection();

				if (selection) {
					for (i=0; i<selection.rangeCount; i++)  {
						let range = selection.getRangeAt(i);
						if (range) {
							console.log(range.startContainer);
							console.log(range.endContainer);
						}
					}
				}
				document.execCommand("formatBlock",false,"<blockquote>");
			});
		}

		this.alignSelect = function(){
			this._alignSelect = $("#hnid-al-sl");
			this.ICONCODE = {
				left:"&#xf036;",
				right:"&#xf038;",
				center:"&#xf037;",
				justify:"&#xf039;"
			}
		}

		this.alignSelect.prototype.Init = function(){
			$(this._alignSelect).find(".select-item").on('click',function(e){
				var d = this.parentNode.parentNode.getElementsByTagName("select")[0];

				that.ExecCommand($(d[d.selectedIndex]).val());

				if($(d[d.selectedIndex]).val() == "justifyLeft") align = "left";
				if($(d[d.selectedIndex]).val() == "justifyRight") align = "right";
				if($(d[d.selectedIndex]).val() == "justifyCenter") align = "center";
				if($(d[d.selectedIndex]).val() == "justifyFull") align = "justify";
			});
		}

		this.alignSelect.prototype.SetSelectIcon = function(alignIcon){
			$(this._alignSelect).children().first().empty().html(alignIcon);
		}

		
		this.__alignSelect = new this.alignSelect();

		this.__blockQuote = new this.blockQuote();

		$(this.txtFormatBtn).on("click",function(e){
			let command = $(this).data("format-command");
			let value = $(this).data("format-value");
			document.execCommand(command,false,value);
		});

		$(this.fontClrPicker).change(function(e){
			let value = $(this).val();
			document.execCommand("foreColor",false,value);
		});

		$(this.fontBackClrPicker).change(function(e){
			let value = $(this).val();
			that.ExecCommand("backColor",value);
		});

		$(this.fontFamilySelect).change(function(e){
			let fontName = $(this).val();
			that.ExecCommand("fontName",fontName);
		});

		$(this.fontSizeSelect).change(function(e){
			let fontSize = $(this).val();

			let fontSizeInEle = document.getSelection().anchorNode.parentElement.style.fontSize;

			if(fontSizeInEle != ""){
				document.getSelection().anchorNode.parentElement.style.fontSize = fontSize + "px";
				return;
			}

			let spanString = $("<span/>",{
				text: document.getSelection()
			}).css("font-size",fontSize + "px").prop("outerHTML");

			document.execCommand("insertHTML",false,spanString);
		});

		$(this.orderListBtn).on("click",function(e){
			inOrderedList = !inOrderedList;
		});
	}

	HnidUI.prototype.Init = function(){
		this.__alignSelect.Init();
		this.__blockQuote.Init();
	}

	let hnidUI = new HnidUI();
	hnidUI.Init();

	document.execCommand("insertHTML",false,'<p align='+ align +'></p>');

	$("#hnid-content").on("empty",function(e){
		document.execCommand("insertHTML",false,'<p align='+ align +'></p>');
	});

	$("#hnid-content").on("mouseup keyup",function(e){

		var child = $(this).children();
		if(child.length <= 1 && $(child[0]).prop("tagName") == "BR"){
			$(this).trigger("empty");
		}

		//get css of current element and update UI
		align = $(document.getSelection().anchorNode).attr("align");
		if(typeof align  === "undefined"){
			align = $(document.getSelection().anchorNode.parentElement).attr("align");
		}

		if(typeof align !== "undefined"){
			let alignCode = "";

			if(align == "left") alignCode = hnidUI.__alignSelect.ICONCODE.left;
			if(align == "right") alignCode = hnidUI.__alignSelect.ICONCODE.right;
			if(align == "center") alignCode = hnidUI.__alignSelect.ICONCODE.center;
			if(align == "justify") alignCode = hnidUI.__alignSelect.ICONCODE.justify;

			hnidUI.__alignSelect.SetSelectIcon(alignCode)
		}
	});
});

var x = document.getElementsByClassName("hidden-select");

for(var i = 0 ;i < x.length;i++){
	//get select
	var selElement = x[i].getElementsByTagName("select")[0];

	//load all option into div
	var y = document.createElement("div");
	$(y).addClass("select-items");
	for(var j = 0;j < selElement.length;j++){
		var z = document.createElement("div");
		$(z).addClass("select-item");
		z.innerHTML = selElement[j].innerHTML;
		var initEvent = function(j){
			$(z).on("click",function(e){
				e.stopPropagation();

				var a = this.parentNode.getElementsByClassName("select-item");
				var b = this.parentNode;

				var c = this.parentNode.parentNode;
				if(c) var d = c.getElementsByTagName("select")[0];
				if(d) {
					$(d).val($(d[d.selectedIndex]).val());
					d.selectedIndex = j
				};

				if($(this).hasClass("select-selected")) return;	

				for(var k = 0; k < a.length;k++){
					if($(a[k]).hasClass("select-selected")){
						$(a[k]).removeClass("select-selected");
					}
				}

				$(this).addClass("select-selected");
				$(b).toggleClass("select-close");
				$(c).children().first().empty().append($(this).html());
			});
		}
		initEvent(j);
		$(y).append(z);
		if(j == 0) z.click();
	}
	$(x).append(y);
}

var hidden_select = document.getElementsByClassName("hidden-select");

for(var i = 0; i < hidden_select.length;i++){
	hidden_select[i].addEventListener("click",function(e){
		$(this.getElementsByClassName("select-items")[0]).toggleClass("select-close");
		closeAllSelect(this.getElementsByClassName("select-items")[0]);
	});
}

function closeAllSelect(exceptElement){
	//close all
	$(".select-items").each(function(index){
		if(typeof exceptElement !== "undefined"){
			if($(this).is(exceptElement)) return;
		}
		if($(this).hasClass("select-close")) return;
		$(this).addClass("select-close");
	});
}