<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>svg_test</title>
  <link rel="stylesheet" type="text/css" href="styles_map.css" media="screen" />
</head>
<body>
  <div id="infoboxWrapper" style="opacity: 0.0; position: absolute; left: 0; top: 0;">
    <div class="infobox-container">
      <div class="triangle-l"></div>
      <div class="triangle-r"></div>
      <div class="infobox">
        <h3><span>This is the Header</span></h3>
        <p>This is the content of the infobox.<p/>
      </div>
    </div>
  </div>
  <%
  '/*
  '*Tokenize the query string and extract values
  '*Essentially build the GET request from the URL
  '*@TODO: Refactor searchTable and searchID into request class
  '*/
  queryString = Request.querystring()
  index = InStr(queryString, "=")
  searchTable = Left(queryString, index-1)
  searchID = Mid(queryString, index+1)
  %>
  <%
  '/*
  '*Create a connection and a session for accessing the db
  '*/
  Set connection = Server.CreateObject("ADODB.Connection")
  connection.Open "maptoolsDatabase"
  Session.timeout = 15
  Set Session("MyDB_conn")=connection
  %>
  '/*
  '*Request for data based on key given in GET variables
  '*@TODO: Refactor to switch statement
  '*/
  If searchTable = "Companies" Then
  	'/*
  	'*Set query, create a record set, execute query, and count results
  	'*@TODO: collapse ifelse to only contain logic for creating sql query to reduce code duplication
  	'*@note: reassigning queryString
  	'*/
  	queryString = "SELECT * FROM Companies WHERE CompanyID LIKE "&"'"&searchID&"'"
  	Set qCompanies = Server.CreateObject("ADODB.recordset")
  	qCompanies.Open queryString, connection, 3, 3
  	count = qCompanies.recordcount
  	'/*
  	'*Many to one mapping of corner cases empty set to "empty"
  	'*/
  	suite = qCompanies("Suite")
  	building = qCompanies("building")
  	if building = "" Or IsEmpty(building) Or IsNull(building) Then
  		building = "empty"
  End If
  ElseIf searchTable = "Individuals" Then
  	'/*
  	'*Set query, create a record set, execute query, and count results
  	'*@note: reassigning queryString
  	'*/
  	queryString = "SELECT * FROM individuals WHERE IndID LIKE "&"'"&searchID&"'"
  	Set qIndividuals = Server.CreateObject("ADODB.recordset")
  	qIndividuals.Open queryString, connection, 3, 3
  	count = qIndividuals.recordcount

  	suite = qIndividuals("Suite")
  	building = qIndividuals("iBuilding")
  	'/*
  	'*Whitelist the empty building corner case
  	'*@TODO: find out of there is some reason this is whitewashed!? commented out
  	'*/
  	if building = "" Or IsEmpty(building) Or IsNull(building) Then
  		building = "empty"
  	End If
  End If
  '/*
  '*Close all connections and release variables for garbage collection
  '*/
  connection.close
  set connection = nothing
  '/*
  '*Write the final response to the server
  '*@TODO: move styles to css
  '*/
  Response.write("<div id='mapvar_bldg' style='display:none'>"&building&"</div><div id='mapvar_suite' style='display:none'>"&suite&"</div>")
  %>
<% '/*
'*Move the scripts to the bottom of the body so they are non blocking
'*/ %>
<canvas id="canvas" width="1455" height="806" style="border:1px solid #d3d3d3;">Your browser does not support the HTML5 canvas tag.</canvas>
<script language="javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script language="javascript" src="http://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.5.0/fabric.min.js"></script>
<% '/*
'*Load the scripts files before the driver
'*/ %>
<script language="javascript" src="scriptFiles/indexScripts.js"></script>
<% '/*
'*Load the driver to launch the app
'*/ %>
<script language="javascript" src="scriptFiles/indexDriver.js"></script>
</body>
</html>
