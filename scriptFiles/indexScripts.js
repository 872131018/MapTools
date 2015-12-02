function animateSegment()
{
  /*
  * Canvas objects consist of line and circle pairs, stop 1 short of end
  */
  if(index < canvas.getObjects().length-1)
  {
    /*
    *Compute delay for next line segment
    */
    var sideA = Math.abs(canvas.item(index).x1 - canvas.item(index+1).left);
    var sideB = Math.abs(canvas.item(index).y1 - canvas.item(index+1).top);
    var length = Math.sqrt((sideA*sideA) + (sideB*sideB));

    //delay = (length/delay);
    /*
    * The line is two over lapping points so animate second point
    * Treat the circle as a new end point and transform the line
    */
    canvas.item(index).animate("x2", canvas.item(index+1).left,
    {
      duration: delay,
      onChange: canvas.renderAll.bind(canvas)
    });
    canvas.item(index).animate("y2", canvas.item(index+1).top,
    {
      duration: delay,
      onChange: canvas.renderAll.bind(canvas)
    });
    canvas.item(index).animate("opacity", 1.0,
    {
      duration: delay,
      onChange: canvas.renderAll.bind(canvas)
    });
    canvas.item(index+1).animate("opacity", 1.0,
    {
      duration: delay,
      onChange: canvas.renderAll.bind(canvas)
    });
    /*
    * Continue animation in a daisy chain fashion
    */
    setTimeout(function()
    {
      animateSegment()
    }, delay);
  }
  /*
  * On final segment reveal finish arrow
  */
  else if(index == canvas.getObjects().length-1)
  {
    canvas.item(index).animate("opacity", 1.0, {
      duration: delay,
      onChange: canvas.renderAll.bind(canvas)
    });
    /*
    * Also animate the reveal of the infobox
    */
    $("#infoboxWrapper").animate(
      {
        opacity: 0.8
      }, 1500);
  }
  /*
  * Increment by two because the lines are paired with points
  */
  index += 2;
  /*
  * Time between intervals is the product of a computation
  * @TODO: refactor to use distance between points to compute speed
  */
}
function createLine(passedPointA, passedPointB)
{
  return new fabric.Line(
    [passedPointA.x, passedPointA.y, passedPointB.x, passedPointB.y],
    {
      opacity: 0,
      strokeWidth: "4",
      stroke: 'red'
    }
  );
}
function createTriangle(passedPoint)
{
  return triangle = new fabric.Triangle(
  {
    width: 12,
    height: 12,
    originX: "center",
    originY: "center",
    fill: 'red',
    opacity: 0,
    left: parseInt(passedPoint.x),
    top: parseInt(passedPoint.y) + 2
  });
}
function createCircle(passedPoint)
{
  return new fabric.Circle(
  {
    radius: 2,
    fill: 'red',
    opacity: 0,
    left: parseInt(passedPoint.x),
    top: parseInt(passedPoint.y)
  });
}
function createPoint(passedIndex, passedArray)
{
  var point = {};
  point.x = parseInt(passedArray[passedIndex].split(",")[0]);
  point.y = parseInt(passedArray[passedIndex].split(",")[1]);
  return point;
}
