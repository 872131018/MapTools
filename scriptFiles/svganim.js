//window.jQuery = window.$ = require("scriptFiles/jquery-x.x.x.js");
//require("scriptFiles/velocity.js");
/*
*All the variables for the page
*/
var genParams = {};
var aspdirloc;
var xmldirloc;
var db;
var colorArr = [];
var speed;

var infoboxParams = {};
var ifbAttrCount;
var ifbParamsLength;
var ifbFont;
var ifbBold;
var ifbItalic;
var ifbTxtColor;
var ifbAlign;
var ifbSize;
var ifbLeading;
var ifbLeftMargin;
var ifbRightMargin;
var ifbTopMargin;
var ifbBottomMargin;
var ifbGraphicMargin;
var ifbMaxWidth;
var ifbSuiteLabel;

var pointArr = [];
//var pathObj = {};
var buildingCount;
var found;
/*
*HTML has loaded, logic can begin at single point
*@TODO: Move ready to indexDriver.js and refactor functions
*/
$(document).ready(function()
{
  body = document.getElementsByTagName('body')[0];
  //makeButtons(); // create dev buttons
  //getQueryString();
  /*
  *Get the data that was left by ASP processing
  */
  var building = $("#mapvar_bldg").html();
  var suite = $("#mapvar_suite").html();
  /*
  *Load an xml that describes the path to draw with ajax
  */
  $.get('paths.xml', function(data, status)
  {
    if(status == 'success')
    {
      var pathsXML = data;
      temp = $(pathsXML).find('speed').text();
      console.log(temp);
      /*
      *Move this to external function and refactor to jquery
      */
      getattrs();
      return true;
    }
    else
    {
      return false;
    }
  }, "xml");
  //doAnim(); ///TEMP //////////////////////
});
function getattrs()
{
	// GENERAL PARAMETERS contained in genParams object
	aspdirloc = pathsDoc.getElementsByTagName("aspdir")[0].attributes.getNamedItem("location").nodeValue;
	genParams.aspdirloc = aspdirloc;

	xmldirloc = pathsDoc.getElementsByTagName("xmlwritedir")[0].attributes.getNamedItem("location").nodeValue;
	genParams.xmldirloc = xmldirloc;

	db = pathsDoc.getElementsByTagName("mdb")[0].attributes.getNamedItem("name").nodeValue;
	genParams.db = db;

	allColors = pathsDoc.getElementsByTagName("colors")[0].childNodes[0].nodeValue;
	genParams.allColors = allColors;
	//colorArr = allColors.split(";"); // DEBUG: make array & show
	//for (var n=0; n < colorArr.length; n++) {
	//	console.log("    colorArr[" + n + "] = " + colorArr[n]);
	//}

	speed = pathsDoc.getElementsByTagName("speed")[0].childNodes[0].nodeValue;
	genParams.speed = speed;

	//showGenParams(); //DEBUG

	// INFOBOX PARAMETERS contained in infoboxParams object
	ifbAttrCount = pathsDoc.getElementsByTagName("infobox")[0].attributes.length;
		//console.log("  ifbAttrCount = " + ifbAttrCount);

	ifbFont = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("font").nodeValue;
	infoboxParams.font = ifbFont;
	ifbBold = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("bold").nodeValue;
	infoboxParams.bold = ifbBold;
	ifbItalic = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("italic").nodeValue;
	infoboxParams.italic = ifbItalic;
	ifbTxtColor = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("txtColor").nodeValue;
	infoboxParams.txtColor = ifbTxtColor;
	ifbAlign = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("align").nodeValue;
	infoboxParams.align = ifbAlign;
	ifbSize = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("size").nodeValue;
	infoboxParams.size = ifbSize;
	ifbLeading = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("leading").nodeValue;
	infoboxParams.leading = ifbLeading;

	ifbLeftMargin = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("leftMargin").nodeValue;
	infoboxParams.leftMargin = ifbLeftMargin;
	ifbRightMargin = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("rightMargin").nodeValue;
	infoboxParams.rightMargin = ifbRightMargin;
	ifbTopMargin = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("topMargin").nodeValue;
	infoboxParams.topMargin = ifbTopMargin;
	ifbBottomMargin = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("bottomMargin").nodeValue;
	infoboxParams.bottomMargin = ifbBottomMargin;
	ifbGraphicMargin = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("graphicMargin").nodeValue;
	infoboxParams.graphicMargin = ifbGraphicMargin;
	ifbMaxWidth = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("maxWidth").nodeValue;
	infoboxParams.maxWidth = ifbMaxWidth;
	ifbSuiteLabel = pathsDoc.getElementsByTagName("infobox")[0].attributes.getNamedItem("suiteLabel").nodeValue;
	infoboxParams.suiteLabel = ifbSuiteLabel;

	ifbParamsLength = Object.keys(infoboxParams).length;
		//console.log("  ifbParamsLength = " + ifbParamsLength);

	//showInfoBoxParams(); //DEBUG
	getPathData();
}

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
}
function showGenParams() { // DEBUG
	console.log("genParams:");
	$.each( genParams, function( key, value ) {
	  console.log( '   ' + key + ': ' + value);
	});
}
function showInfoBoxParams() { // DEBUG
	console.log("infoboxParams:");
	$.each( infoboxParams, function( key, value ) {
	  console.log( '   ' + key + ': ' + value);
	});
}
// function showPathObj() { // DEBUG
// 	console.log("pathObj:");
// 	$.each( pathObj, function( key, value ) {
// 	  console.log( '   ' + key + ': ' + value);
// 	});
// }


// DRAW //////////////////////////////////////////////////////

function getPathData() {
		console.log("getPathData called");
		//console.log("  pathsDoc = " + pathsDoc);

	// PATH DATA
	x = pathsDoc.getElementsByTagName("building");
	buildingCount = x.length;
		//console.log("  buildingCount = " + buildingCount);

	for (n=0; n < buildingCount; n++) {
		var thisBldgName = x[n].attributes.getNamedItem("name").nodeValue;
		if (thisBldgName == "") {
			thisBldgName = "empty";
		}

		var thisSuiteCount = x[n].getElementsByTagName("suite").length;
			//console.log(" > bldg " + n + ": thisBldgName = " + thisBldgName + ", suites = " + thisSuiteCount);

		if (thisBldgName == bldg) {
			console.log("thisBldgName " + thisBldgName + " match");

			found = false;

			for (var i=0; i<thisSuiteCount; i++) {
				y = x[n].getElementsByTagName("suite")[i];
				thisSuiteName = y.attributes.getNamedItem("name").nodeValue;

				if (thisSuiteName == suite) {
						//console.log("thisSuiteName " + thisSuiteName + " match");

					thisBasemap = y.attributes.getNamedItem("basemap").nodeValue;
					thisIboxLoc = y.attributes.getNamedItem("ibox").nodeValue;

					var points = y.getElementsByTagName("points")[0].childNodes[0].nodeValue;
						console.log("  >> i = " + i + ": thisSuiteName = " + thisSuiteName + "  thisBasemap = " + thisBasemap + "  thisIboxLoc = " + thisIboxLoc + "  points: " + points);
					pointArr = points.split(";");
						//console.log("pointArr[0] = " + pointArr[0] );

					found = true;
					break;

				}
			}

			if (found == false) {
				console.log("suite not found");
			} if (found == true) {
				console.log("suite found, calling doAnim()");
				doAnim();	// this draws each segment concurrently. Should be refactored to draw each segment sequentially
			}

		} else {
			console.log("building not found");
		}
	}
}

function doAnim() {
	console.log('doAnim called');

	// mapCont = document.createElement("div");
 //  mapCont.setAttribute('id', 'mainmapcont');

 //  svgCont = document.createElement("svg");
 //  svgCont.setAttribute('id', 'svgcont');
  // svgCont.width = "1000px";
  // svgCont.height = "1000px";
  // mapCont.appendChild(svgCont);
  // body.appendChild(mapCont);

  pointsCount = pointArr.length;
	console.log(' pointsCount = ' + pointsCount);
  segmentCount = pointArr.length - 1;
	console.log(' segmentCount = ' + segmentCount);

	// div container
	mapCont = document.createElement("div");
	mapCont.setAttribute('id', 'mainmapcont');
	mapCont.setAttribute("style", "border: 1px solid red;");
	mapCont.style.width = "1455px";  // needs display area width var
	mapCont.style.height = "806px";  // needs display area height var
	mapCont.style.position = "absolute";
	mapCont.style.left = "10px";  // needs display area left position var
	mapCont.style.top = "10px";  // needs display area top position var

	// svg container
	var svgcont = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svgcont.setAttribute('style', 'border: 1px solid black');
	svgcont.style.width = "1449px";  // needs display area width var
	svgcont.style.height = "800px";  // needs display area height var
	svgcont.style.position = "absolute";
	svgcont.style.left = "2px";
	svgcont.style.top = "2px";
	//svgcont.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

	for (p=0;p<segmentCount;p++) {
			console.log('  segment = ' + p);

		point1 = pointArr[p].split(",");
		point2 = pointArr[p+1].split(",");
		x1 = point1[0];
		y1 = point1[1];
		console.log(' x1 = ' + x1 + '; y1 = ' + y1);
		x2 = point2[0];
		y2 = point2[1];
			console.log(' x2 = ' + x2 + '; y2 = ' + y2);

		var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		aLine.setAttribute('id', 'line'+p);
    aLine.setAttribute('x1', x1);
    aLine.setAttribute('y1', y1);
    aLine.setAttribute('x2', x1);
    aLine.setAttribute('y2', y1);
    aLine.setAttribute('stroke', 'red'); // needs segment color var
    aLine.setAttribute('stroke-width', 10); // needs segment width var


    if (p < segmentCount-1) { // put a circle on the end of each segment to cover the open joint; not on the last one
			var aCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			aCircle.setAttribute('id', 'circle'+p);
	    aCircle.setAttribute('cx', x2);
	    aCircle.setAttribute('cy', y2);
	    aCircle.setAttribute('r', 5); // needs half the segment width var for the radius
	    aCircle.setAttribute('stroke', 'none'); // needs segment color var
	    aCircle.setAttribute('fill', 'red'); // needs segment width var
	  }

		svgcont.appendChild(aLine);
		svgcont.appendChild(aCircle);
		mapCont.appendChild(svgcont);
		document.body.appendChild(mapCont);

		// $("#line"+p).css( {"stroke": 000} );
		// $("#line"+p).css( {"stroke-width": 5} );
		// $("#line"+p).css( {"x1": x1, "y1": y1 } );

		// $("#line"+p).css( {"x2": x2, "y2": y2 } );

		$("#line"+p).velocity({
			properties: {"x2": x2, "y2": y2 },
			options: {duration: 1000, easing: "linear", queue: false} // needs duration calculated based on length of segment, so each segment is drawn at the same speed
		});

	}

}

// TODO: calculate the angle of final segment, and place arrow on end of final segment at that angle.
// the following code is ActionScript (Flash) for placing the arrow
/*
function getLastLineRotation():void {
	pos1.x = coordArray[coordArray.length-2].x;
	pos1.y = coordArray[coordArray.length-2].y;
	pos2.x = coordArray[coordArray.length-1].x;
	pos2.y = coordArray[coordArray.length-1].y;
	lastAngle = Math.round((Math.atan((pos2.y-pos1.y) / (pos2.x-pos1.x)) * 180) / Math.PI);;
	if (pos2.x<pos1.x){
		lastAngle = lastAngle + 180;
	}else if (pos2.x<pos1.x && pos1.y==pos2.y){
		lastAngle = 180;
	}
		//Main.testMsgBox.addText("getLastLineRotation: lastAngle = " + lastAngle);
}

function placeArrow(x:Number, y:Number, r:Number):void {
		//Main.testMsgBox.addText("placeArrow: x=" + x + ", y=" + y + ", r=" + r);
	if (arrowPlaced == false){
		if (firstLinePlaced == false){
			return;
		}else if (firstLinePlaced == true){
			var arrow:Sprite = new Sprite();
			with (arrow.graphics) {
				beginFill(lineColor, 1.0);
				moveTo(0, 0);
				lineTo(0, -15);
				lineTo(25, 0);
				lineTo(0, 15);
				lineTo(0, 0);
				endFill();
			}
			arrow.x = x;
			arrow.y = y;
			arrow.rotation = r;
			addChild(arrow);

			lineList.push(arrow);
			arrowPlaced = true;
		}
	}else if (arrowPlaced == true){
		return;
	}
}
*/

// test & debug functions
function doAnim1() { // button function
		console.log('doAnim1 called');

	$("#line1").css( {"stroke-width": "5px"} );

	$("#line1").velocity({
		properties: {"x2": 100, "y2": 700 },
		options: {duration: 1000, easing: "linear", queue: false}
	});
}

function clearsvg() {  // button function
		console.log('clearsvg called');

	$("#line1").attr("x2", 0 );
	$("#line1").attr("y2", 0 );
}

// NOT USED //////////////////////////////////////////////////////
// var querystring;
// var searchTable;
// var searchID;

/*
function getQueryString() {
	querystring = window.location.search.substring(1);
  console.log('querystring = ' + querystring);
	qsSplit = querystring.split("=");
	searchTable = qsSplit[0];
	searchID = qsSplit[1];
  console.log('searchTable = ' + searchTable + "; searchID = " + searchID);

  // DEBUG
	qspara = document.createElement('div');
	qspara.setAttribute('id', 'qspara');
	qsnode = document.createTextNode( "querystring:  " + querystring );
	qspara.appendChild(qsnode);
	body.appendChild(qspara);
}*/
