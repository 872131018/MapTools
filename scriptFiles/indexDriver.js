/*
*HTML has loaded, logic can begin in a single place
*/
$(document).ready(function()
{
  /*
  * Only support a few global variables
  * Index for iterating final segments during animation
  * Delay holds time between animation segments
  * IntervalID will be used to clear the interval during the animation
  */
  index = 0;
  delay = 500;
  IntervalID = 0;
  /*
  *Initialize the global around native canvas element (with id="c")
  */
  canvas = new fabric.StaticCanvas("canvas");
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
      * Move the infobox to its location and reveal
      */
      var coordinates = $(xmlData).find("suite[name='"+$("#mapvar_suite").html()+"']").attr("ibox").split(",");
      coordinates = {'x': coordinates[0], 'y': coordinates[1] };
      $("#infoboxWrapper").css("left", coordinates.x+"px");
      $("#infoboxWrapper").css("top", coordinates.y+"px");
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
              *Create line circle pair from set of points and add it to canvass
              */
              canvas.add(
                createLine(
                  createPoint(parseInt(currentSegment), pointsArray),
                  createPoint(parseInt(currentSegment), pointsArray)
                ));
              /*
              *Create a circle from point and add it to the canvas
              *the circle is for blending the line intersection
              *@TODO: find a curve to blend the intersection rather than use a circle
              */
              canvas.add(
                createCircle(
                  createPoint(parseInt(currentSegment)+1, pointsArray)
                ));
            }
            /*
            * Put the finishing arrow on the final segment instead of circle
            */
            else if(parseInt(currentSegment) == pointsArray.length-1)
            {
              canvas.add(
                createTriangle(
                  createPoint(parseInt(currentSegment), pointsArray)
                ));
              /*
              *Convert final line circle pair to a rotation for the arrow
              */
              var pointA = createPoint(parseInt(currentSegment), pointsArray);
              var pointB = createPoint(parseInt(currentSegment)-1, pointsArray);
              /*
              * Find the rotation angle based on the angle of the last line
              */
              //var rotation =  Math.round(Math.atan((pointA.y - pointB.y), pointA.x - pointB.x) * (180 / Math.PI));
              var rotation =  Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) * (180 / Math.PI);
              /*
              *Rotate by 90 to account for the difference between the positive x axis and the triangle default rotation
              */
              rotation += 90;
              /*
              * Set rotation for the angle based on the computed value
              */
              triangle.angle = rotation;
            }
          }
        });
      });
      /*
      * Begin animation of line segments in path
      */
      setTimeout(function()
      {
        animateSegment()
      }, delay);
    }
    else
    {
      console.log("some kind of error I need to handle this!")
    }
  });
});
