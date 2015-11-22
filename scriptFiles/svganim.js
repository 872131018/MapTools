//window.jQuery = window.$ = require("scriptFiles/jquery-x.x.x.js");
//require("scriptFiles/velocity.js");
/*
*All the variables for the page
*/
var genParams = {};
var infoboxParams = {};
var ifbAttrCount;
var ifbParamsLength;
var pointArr = [];
//var pathObj = {};
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
  *Load an xml with ajax that describes the path to draw
  */
  $.get('paths.xml', function(data, status)
  {
    if(status == 'success')
    {
      var pathsXML = data;
      /*
      *Construct array of general params from the xml
      *@TODO: refactor the xml to have consistent data delivery pattern for factory
      *@TODO: Loop the xml to extract data to objects with a factory method
      */
      genParams["aspdir"] = $(pathsXML).find("aspdir").attr("location");
      genParams["xmlwritedir"] = $(pathsXML).find("xmlwritedir").attr("location");
      genParams["db"] = $(pathsXML).find("mdb").attr("name");
      genParams["allColors"] = $(pathsXML).find("colors").text();
      ganParams["speed"] = $(pathsXML).find("speed").text();
      /*
      *Construct the params for the infobox object from the xml
      *@TODO: refactor the xml to have consistent data delivery pattern for factory
      *@TODO: Pass node to object constructor method
      */
      ifbAttrCount = $(pathsXML).find("infobox").attr("length");
      infoboxParams["font"] = $(pathsXML).find("infobox").attr("font");
      infoboxParams["bold"] = $(pathsXML).find("infobox").attr("bold");
      infoboxParams["italic"] = $(pathsXML).find("infobox").attr("italic");
      infoboxParams["txtColor"] = $(pathsXML).find("infobox").attr("txtColor");
      infoboxParams["align"] = $(pathsXML).find("infobox").attr("align");
      infoboxParams["size"] = $(pathsXML).find("infobox").attr("size");
      infoboxParams["leading"] = $(pathsXML).find("infobox").attr("leading");
      infoboxParams["leftMargin"] = $(pathsXML).find("infobox").attr("leftMargin");
      infoboxParams["rightMargin"] = $(pathsXML).find("infobox").attr("rightMargin");
      infoboxParams["topMargin"] = $(pathsXML).find("infobox").attr("topMargin");
      infoboxParams["bottomMargin"] = $(pathsXML).find("infobox").attr("bottomMargin");
      infoboxParams["graphicMargin"] = $(pathsXML).find("infobox").attr("graphicMargin");
      infoboxParams["maxWidth"] = $(pathsXML).find("infobox").attr("maxWidth");
      infoboxParams["suiteLabel"] = $(pathsXML).find("infobox").attr("suiteLabel");
      ifbParamsLength = Object.size(infoboxParams);
      /*
      *Move this to external function and refactor to jquery
      */
      getPathData();
      return true;
    }
    return false;
  },"xml");
  //doAnim(); ///TEMP //////////////////////
});

// DRAW //////////////////////////////////////////////////////
function getPathData()
{
  x = pathsDoc.getElementsByTagName("building");
	buildingCount = x.length;

  $.each($(pathsXML).find("building"), function(buildingIndex, currentBuilding)
  {
    var buildingName = currentBuilding.attr("name");
    var thisSuiteCount = currentBuilding.length;
    if (buildingName == "")
    {
			buildingName = "empty";
		}
    if(buildingName == building)
    {
      var found = false;
      $.each(currentBuilding.find("suite"), function(suiteIndex, currentSuite)
      {
        var currentSuiteName = currentSuite.attr("name");
        if(currentSuiteName == suite)
        {
          var thisBaseMap = currentSuite.attr("basemap");
          var thisIboxLocation = currentSuite.attr("ibox");
          var pointsArray = currentSuite.find("points").text.split(";");
          found = true;
          break;
        }
      });
      if(found == false)
      {
				console.log("suite not found");
			}
      if(found == true)
      {
				console.log("suite found, calling doAnim()");
				doAnim();	// this draws each segment concurrently. Should be refactored to draw each segment sequentially
			}
    }
    else
    {
      console.log("building not found");
    }
  });
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
// function showPathObj() { // DEBUG
// 	console.log("pathObj:");
// 	$.each( pathObj, function( key, value ) {
// 	  console.log( '   ' + key + ': ' + value);
// 	});
// }
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
