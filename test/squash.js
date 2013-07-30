/*jslint nomen: true */
'use strict';

var squash = require('../lib/squash'),
	urlArray,
	colNames;

urlArray = [
	'/*/user/name',
	'/*/user/id',
	'/*/user/lang',
	'/*/text',
	'/*/id',
	'/*/url',
	'/*/followers_count'
];

colNames = [
	"name",
	"user id",
	"language",
	"text",
	"twitter id",
	"url",
	"follower count"
];

console.log("urlArray = %j", urlArray);
console.log("colNames = %j", colNames);

squash.json({}).getTableWithArray(urlArray, colNames);