/*
*HTML has loaded, logic can begin in a single place
*/
$(document).ready(function()
{
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
      var canvas = new fabric.StaticCanvas("canvas");
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
            * Put the finishing arrow on the final segment
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
              //var pointA = pointsArray[currentSegment].split(",");
              //var pointB = pointsArray[parseInt(currentSegment)-1].split(",");
              /*
              * Find the rotation angle based on the angle of the last line
              */
              //var rotation =  Math.round(Math.atan(parseInt(pointA[1])-parseInt(pointB[1])) / parseInt(pointA[0])-parseInt(pointB[0]) * 180) / Math.PI;
              //console.log(pointB);
              //triangle.angle = rotation;
            }
          }
        });
      });
      /*
      * Animate each line of the canvas
      */
      index = 0;
      intervalId = setInterval( function() {
        /*
        * Canvas objects consist of line and circle pairs
        */
        if(index < canvas.getObjects().length-1)
        {
          /*
          * The line is two over lapping points when it is created
          * Treat the circle as a new end point and animate transformation
          */
          canvas.item(index).animate("x2", canvas.item(index+1).left, {
            onChange: canvas.renderAll.bind(canvas)
          });
          canvas.item(index).animate("y2", canvas.item(index+1).top, {
            onChange: canvas.renderAll.bind(canvas)
          });
          canvas.item(index).animate("opacity", 1.0, {
            onChange: canvas.renderAll.bind(canvas)
          });
          canvas.item(index+1).animate("opacity", 1.0, {
            onChange: canvas.renderAll.bind(canvas)
          });
        }
        /*
        * On final segment clear interval and add finish arrow
        */
        else if(index == canvas.getObjects().length)
        {
          clearInterval(intervalId);
        }
        /*
        * Increment by two because they are related objects
        */
        index += 2;
        /*
        * Time between intervals is the product of a computation
        * @TODO: refactor to use distance between points to compute speed
        */
      }, 500);
    }
    else
    {
      console.log("some kind of error I need to handle this!")
    }
  });
});
