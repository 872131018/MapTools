//window.jQuery = window.$ = require("scriptFiles/jquery-x.x.x.js");
//require("scriptFiles/velocity.js");
/*
*HTML has loaded, logic can begin at single point
*@TODO: Move ready to indexDriver.js and refactor functions
*/
$(document).ready(function()
{
  //makeButtons(); // create dev buttons
  /*
  *Load an xml with ajax that describes the path to draw
  */
  $.get('paths.xml', function(xmlData, status)
  {
    if(status == 'success')
    {
      /*
      *Return failure if the file is empty
      *@TODO: also add error handling for failed requests
      */
      if(xmlData == '')
      {
        return false;
      }
      /*
      *Create an object for the general parameters from the xml
      *@TODO: refactor the xml to have consistent data delivery pattern for factory
      *@TODO: Loop the xml to extract data to objects with a factory method
      */
      var genParams = {};
      genParams["aspdir"] = $(xmlData).find("dataroot").find("aspdir").attr("location");
      genParams["xmlwritedir"] = $(xmlData).find("dataroot").find("xmlwritedir").attr("location");
      genParams["db"] = $(xmlData).find("dataroot").find("mdb").attr("name");
      genParams["allColors"] = $(xmlData).find("dataroot").find("colors").text();
      genParams["speed"] = $(xmlData).find("dataroot").find("speed").text();
      /*
      *Create an object for the infobox parameters from the xml
      *@TODO: refactor the xml to have consistent data delivery pattern for factory
      *@TODO: Pass node to object constructor method
      */
      var infoboxParams = {};
      infoboxParams["font"] = $(xmlData).find("infobox").attr("font");
      infoboxParams["bold"] = $(xmlData).find("infobox").attr("bold");
      infoboxParams["italic"] = $(xmlData).find("infobox").attr("italic");
      infoboxParams["txtColor"] = $(xmlData).find("infobox").attr("txtColor");
      infoboxParams["align"] = $(xmlData).find("infobox").attr("align");
      infoboxParams["size"] = $(xmlData).find("infobox").attr("size");
      infoboxParams["leading"] = $(xmlData).find("infobox").attr("leading");
      infoboxParams["leftMargin"] = $(xmlData).find("infobox").attr("leftMargin");
      infoboxParams["rightMargin"] = $(xmlData).find("infobox").attr("rightMargin");
      infoboxParams["topMargin"] = $(xmlData).find("infobox").attr("topMargin");
      infoboxParams["bottomMargin"] = $(xmlData).find("infobox").attr("bottomMargin");
      infoboxParams["graphicMargin"] = $(xmlData).find("infobox").attr("graphicMargin");
      infoboxParams["maxWidth"] = $(xmlData).find("infobox").attr("maxWidth");
      infoboxParams["suiteLabel"] = $(xmlData).find("infobox").attr("suiteLabel");
      ifbAttrCount = $(xmlData).find("infobox").attr("length");
      ifbParamsLength = infoboxParams.size;
      /*
      *Draw the path for each building
      *@TODO: this doesn't need to iterate through all paths, could use selectors to find
      */
      $(xmlData).find("dataroot").find("building").each(function(buildingIndex, currentBuilding)
      {
        var thisSuiteCount = $(currentBuilding).children().length;
        if ($(currentBuilding).attr("name") == "")
        {
    			$(currentBuilding).attr("name", "empty");
    		}
        if($(currentBuilding).attr("name") == $("#mapvar_bldg").html())
        {
          $(currentBuilding).find("suite").each(function(suiteIndex, currentSuite)
          {
            if($(currentSuite).attr("name") == $("#mapvar_suite").html())
            {
              var thisBaseMap = $(currentSuite).attr("basemap");
              var thisIboxLocation = $(currentSuite).attr("ibox");
              var pointsArray = $(currentSuite).find("points").text().split(";");

              pointsCount = pointsArray.length;
              segmentCount = pointsArray.length - 1;

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

              for(currentSegment in pointsArray)
              {
                if(parseInt(currentSegment) < pointsArray.length-1)
                {
                  var pointA = pointsArray[currentSegment].split(",");
                  var pointB = pointsArray[parseInt(currentSegment)+1].split(",");
                  var x1 = pointA[0];
                  var y1 = pointA[1];
                  var x2 = pointB[0];
                  var y2 = pointB[1];

                  var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                  aLine.setAttribute('id', 'line'+currentSegment);
                  aLine.setAttribute('x1', x1);
                  aLine.setAttribute('y1', y1);
                  aLine.setAttribute('x2', x1);
                  aLine.setAttribute('y2', y1);
                  aLine.setAttribute('stroke', 'red'); // needs segment color var
                  aLine.setAttribute('stroke-width', 10); // needs segment width var

                  if(currentSegment<segmentCount-1)
                  { // put a circle on the end of each segment to cover the open joint; not on the last one
                    var aCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    aCircle.setAttribute('id', 'circle'+currentSegment);
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

                  $("#line"+currentSegment).velocity({
                    properties:
                    {
                      "x2": x2,
                      "y2": y2
                    },
                    options:
                    {
                      duration: 1000,
                      easing: "linear",
                      queue: false
                    } // needs duration calculated based on length of segment, so each segment is drawn at the same speed
                  });
                }
            	}
              return true;
            }
          });
        }
        else
        {
          console.log("building not found");
        }
      });
    }
    else
    {
      console.log("some kind of server err")
      return false;
    }
  });
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
}
// function showPathObj() { // DEBUG
// 	console.log("pathObj:");
// 	$.each( pathObj, function( key, value ) {
// 	  console.log( '   ' + key + ': ' + value);
// 	});
// }


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
