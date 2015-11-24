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
  *@TODO: also add error handling for failed requests or if the file is empty
  */
  $.get('paths.xml', function(xmlData, status)
  {
    /*
    *Define conditions that describe complete path
    *@TODO: need to write error handlers for when request fails or xml is malformed
    */
    if(status == 'success' && xmlData != '')
    {
      /*
      *Initialize the wrapper around native canvas element (with id="c")
      */
      var canvas = new fabric.Canvas("canvas");
      /*
      *Select each building that was placed in the page by ASP (should be one?)
      *@TODO: Find out of multiple buildings could be selected
      */
      $(xmlData).find("building").each(function(buildingIndex, currentBuilding)
      {
        /*
        *Select each suite from the building that is selected
        */
        $(currentBuilding).find("suite[name='"+$("#mapvar_suite").html()+"']").each(function(suiteIndex, currentSuite)
        {
          /*
          *Path to a suite is made up of an array of cartesian coordinates
          */
          var pointsArray = $(currentSuite).find("points").text().split(";");
          /*
          *Use the collection of segments to create the path
          */
          for(currentSegment in pointsArray)
          {
            /*
            *Stop 1 element short of the end of the array
            */
            if(parseInt(currentSegment) < pointsArray.length-1)
            {
              /*
              *Convert line to a set of points
              *@TODO: convert point sets to be objects
              */
              var pointA = pointsArray[currentSegment].split(",");
              var pointB = pointsArray[parseInt(currentSegment)+1].split(",");
              /*
              *Create a line by adding [x1, y1, x2, y2] and stroke color
              */
              var line = new fabric.Line(
                [parseInt(pointA[0]), parseInt(pointA[1]), parseInt(pointA[0]), parseInt(pointA[1])],
                {
                  strokeWidth: "4",
                  stroke: 'red'
                }
              );
              canvas.add(line);
              /*
              *Create a circle by adding [x1, y1], radius, and fill color
              *the purpose of the circle is to blend the line intersection
              *@note: Don't put a circle on the last line segment
              *@TODO: find a curve to blend the intersection rather than use a circle
              */
              if(parseInt(currentSegment) < pointsArray.length-2)
              {
                var circle = new fabric.Circle(
                {
                  fill: 'red',
                  left: pointB[0],
                  top: pointB[1]
                });
                canvas.add(circle);
              }
            }
          }
        });
      });
      /*
      *Animate each line of the canvas
      */
      index = 0;
      setInterval(function(){
        if(index < canvas.getObjects().length-1)
        {
          canvas.item(index).animate("x2", canvas.item(index+1).left, {
            onChange: canvas.renderAll.bind(canvas)
          });
          canvas.item(index).animate("y2", canvas.item(index+1).top, {
            onChange: canvas.renderAll.bind(canvas)
          });
          index += 2;
        }
      }, 500);
    }
    else
    {
      console.log("some kind of error I need to handle this!")
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
