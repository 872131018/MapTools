<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>svg_test</title>
  <link rel="stylesheet" type="text/css" href="styles_map.css" media="screen" />
</head>
<body>
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
'/*
'*Create a connection and a session for accessing the db
'*/
Set connection = Server.CreateObject("ADODB.Connection")
connection.Open "maptoolsDatabase"
Session.timeout = 15
Set Session("MyDB_conn")=connection
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
ElseIf searchtable = "Individuals" Then
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
'*/
Response.write("<div id='mapvar_bldg' style='display:none'>"&building&"</div><div id='mapvar_suite' style='display:none'>"&suite&"</div>")
%>
<!--div class="svgcont" >
	<svg width="800" height="800">
		<line id="line1" x1="0" y1="0" x2="100" y2="100" style="stroke:rgb(200,50,0);stroke-width:2" />
	</svg>
</div-->
<% '/*
'*Move the scripts to the bottom of the body so they are non blocking
'*/ %>
<script language="javascript" src="scriptFiles/jquery-2.1.3.min.js"></script>
<script language="javascript" src="scriptFiles/velocity.js"></script>
<script language="javascript" src="scriptFiles/svganim.js"></script>
</body>
</html>
