//window.jQuery = window.$ = require("scriptFiles/jquery-x.x.x.js");
//require("scriptFiles/velocity.js");


$(document).ready(function() {
  //console.log('display: ready');

  body = document.getElementsByTagName('body')[0];

  makeButtons(); // create dev buttons

});

// BUTTONS for dev use only /////////////////////////////////
function makeButtons(){
	animBtn1 = document.createElement('input');
  animBtn1.setAttribute('id', 'anim1btn');
  animBtn1.setAttribute('type','button');
	animBtn1.setAttribute('value',' ANIM 1 ');
	animBtn1.onclick = function() { doAnim1() }; 
  body.appendChild(animBtn1);

	clearBtn = document.createElement('input');
  clearBtn.setAttribute('id', 'clearBtn');
  clearBtn.setAttribute('type','button');
	clearBtn.setAttribute('value',' CLEAR ');
	clearBtn.onclick = function() { clearsvg() }; 
  body.appendChild(clearBtn);

/*
  singleBtn = document.createElement('input');
  singleBtn.setAttribute('id', 'singleBtn');
  singleBtn.setAttribute('type','button');
	singleBtn.setAttribute('value',' SINGLE TWEET ');
	singleBtn.onclick = function() { runSingleTweet() }; 
  body.appendChild(singleBtn);

  stopDisplayBtn = document.createElement('input');
  stopDisplayBtn.setAttribute('id', 'stopDisplayBtn');
  stopDisplayBtn.setAttribute('type','button');
	stopDisplayBtn.setAttribute('value',' STOP ');
	stopDisplayBtn.onclick = function() { stopTweetDisplays() }; 
  body.appendChild(stopDisplayBtn);
*/
}

function doAnim1() {
	console.log('doAnim1 called');

	//$("#line1").attr("x2", 200 );
	//$("#line1").attr("y2", 200 );
/*
	$("#line1").css( {"stroke-width": "7px"} );

	xlen = $("#line1").attr("x2");
	ylen = $("#line1").attr("y2");

	//console.log('  xlen = ' + xlen + '  ylen = ' + ylen);

	$("#line1").attr("x2", Number(xlen) + 10 );
	$("#line1").attr("y2", Number(ylen) + 10 );


	xlen = $("#line1").attr("x2");
	ylen = $("#line1").attr("y2");

	//console.log('  after: xlen = ' + xlen + ' ylen = ' + ylen);
*/

/*
	$("#line1").delay(1000).animate(
		{"x2": 200 }, 100, "linear", function() {
			// callback
	}); 
*/

	/*
	$("#line1").animate(
		{"x2": 200 }, 1000, "linear", function() {
			// callback
	});*/

/*
	$("#line1").velocity(
		{"x2": 200 }{"y2": 200 }, 1000, "linear", function() {
			// callback
	}); */

	//$("#line1").velocity( {"x2": 200 }, 1000, "linear");
	//$("#line1").velocity( {"y2": 200 }, 1000, "linear");

//	$("#line1").velocity( {"x2": 200 }, {duration: 500, easing: "linear"} );
//	$("#line1").velocity( {"y2": 200 }, {duration: 500, easing: "linear", queue: false} );


	$("#line1").velocity({
		properties: {"x2": 200, "y2": 400 }, 
		options: {duration: 1000, easing: "linear", queue: false}
	});




}


function clearsvg() {
	console.log('clearsvg called');

	$("#line1").css( {"stroke-width": "2px"} );

	xlen = $("#line1").attr("x2");
	ylen = $("#line1").attr("y2");

	if (xlen > 50 && ylen > 50) {
		$("#line1").attr("x2", Number(xlen) - 10 );
		$("#line1").attr("y2", Number(ylen) + 10 );
	} 




}



