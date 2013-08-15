/*jslint nomen: true */

/*global beforeEach, afterEach, describe, it, expect */

/*global console */
/*global debugger */
/*global dependencies */

console.log("im runninf?");

dependencies({'squash' : '../../build/squash'}).init(this, function (squash) {
    'use strict';

    describe("uriTree", function () {

        var urlArray,
            colNames,
            jsonData;


        jsonData = [
            {
                user: {
                    name: "Greg",
                    id: 42,
                    lang: "English"
                },
                text: "This is a Tweet",
                id: "123123123",
                url: "greg@greg.com",
                followers_count: 42
            },
            {
                user: {
                    name: "Tyler",
                    id: 43,
                    lang: "Spanish"
                },
                text: "Lisa!!!!",
                id: "234234234",
                url: "tyler@tylwer.com",
                followers_count: 123
            },
            {
                user: {
                    name: "David",
                    id: 349,
                    lang: "Philosophy"
                },
                text: "Evidence or Implimentation",
                id: "424242424242",
                url: "greg@greg.com",
                followers_count: 9001
            }
        ];

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

        console.log("jsonData = %j", jsonData);
        console.log("urlArray = %j", urlArray);
        console.log("colNames = %j", colNames);

        squash.json(jsonData).getTableWithArray(urlArray, colNames);

    });
});