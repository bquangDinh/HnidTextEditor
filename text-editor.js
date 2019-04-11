"use strict";

$(".txt-fm-cop-btn").on('click',function(){
	let command = $(this).data("format-command");
	document.execCommand(command);
});

$("#txt-fm-sl-f-family").change(function(e){
	let fontFamily = $(this).val();
	document.execCommand("fontName",false,fontFamily);
});

$("#txt-fm-sl-f-size").change(function(e){
	let selection = document.getSelection();
	console.log(selection);

	let fontSize = $(this).val();
	let spanString = $("<span/>",{
		text: document.getSelection()
	}).css("font-size",fontSize + "px").prop("outerHTML");

	document.execCommand("insertHTML",false,spanString);
});

$("#hnid-content").select(function(){
	let parentNode = document.getSelection().anchorNode.parentElement;
	console.log(parentNode);
});