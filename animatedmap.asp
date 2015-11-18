<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>svg_test</title>
	<script language="javascript" src="scriptFiles/jquery-2.1.3.min.js"></script>
	<script language="javascript" src="scriptFiles/velocity.js"></script>
  <script language="javascript" src="scriptFiles/svganim.js"></script>
  <link rel="stylesheet" type="text/css" href="styles_map.css" media="screen" />
</head>

<body>

<%
qs = request.querystring()
'response.write("qs =  " & qs & "<br>")
pos = InStr(qs,"=")
searchtable = Left(qs,pos-1)
searchID = Mid(qs,pos+1)
'response.write("searchtable =  " & searchtable & "<br>searchID =  " & searchID )

Session.timeout = 15
Set conn = server.createObject("ADODB.Connection")
conn.open "map_player_dev"
Set Session("MyDB_conn")=conn

If searchtable = "Companies" Then

	StrSQLQuery = "SELECT * FROM Companies WHERE CompanyID LIKE '"&searchID&"' "
	Set qCompanies = Server.CreateObject("ADODB.recordset")
	qCompanies.Open StrSQLQuery, conn, 3, 3

	count = qCompanies.recordcount

	bldg = qCompanies("building")
	if bldg = "" Or IsEmpty(bldg) Or IsNull(bldg) Then
		bldg = "empty"
	End If

	suite = qCompanies("Suite")
	'Response.write("<br>count = " & count)
	'Response.write("<br>bldg = " & bldg)
	'Response.write("<br>Suite = " & suite)

ElseIf searchtable = "Individuals" Then

	StrSQLQuery = "SELECT * FROM individuals WHERE IndID LIKE '"&searchID&"' "
	Set qIndividuals = Server.CreateObject("ADODB.recordset")
	qIndividuals.Open StrSQLQuery, conn, 3, 3

	count = qIndividuals.recordcount

	bldg = qIndividuals("iBuilding")
	if bldg = "" Or IsEmpty(bldg) Or IsNull(bldg) Then
		bldg = "empty"
	End If

	suite = qIndividuals("Suite")
	'Response.write("<br>count = " & count)
	'Response.write("<br>bldg = " & bldg)
	'Response.write("<br>Suite = " & suite)

End If

conn.close
set conn = nothing

Response.write("<div id='mapvar_bldg' style='display:none'>" & bldg & "</div><div id='mapvar_suite' style='display:none'>" & suite & "</div>")

%>

<!--div class="svgcont" >
	<svg width="800" height="800">
		<line id="line1" x1="0" y1="0" x2="100" y2="100" style="stroke:rgb(200,50,0);stroke-width:2" />
	</svg>
</div-->

</body>

</html>
