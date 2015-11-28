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
    width: 10,
    height: 10,
    fill: 'red',
    left: parseInt(passedPoint.x) - 5,
    top: parseInt(passedPoint.y) -5
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
