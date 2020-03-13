@set @JScript=1/*
@echo off
setlocal

C:\Windows\System32\cscript //nologo //E:JScript "%~f0"
goto :eof

*/

// JScript
//
var ForReading= 1;
var ForWriting = 2;

var fso = new ActiveXObject("Scripting.FileSystemObject");
// var input = fso.OpenTextFile("imsmanifest.xml", ForReading)
// var output = fso.OpenTextFile("imsmanifest2.xml", ForWriting, true)
var input = fso.OpenTextFile("imsmanifest.xml", ForReading);
var output = fso.OpenTextFile("viewer_xml.js", ForWriting, true);


var data = input.Readall();
//data = data.replace(/\x0A/gi, "");
data = data.replace(/\r|\n/gi, "");
//data = data.replace(/\x0D/gi, "\x0D\x0A");
var result = "var xmldata = ";
output.Write(result + "'" + data + "';");
//output.Write(data);

input.Close();
output.Close();