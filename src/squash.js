/*jslint node: true, nomen: true */
'use strict';

var _ = require('underscore'),
    sproutid = require('sproutid');


function jsonFunc(jsonData) {

    //duplicate functions
    function headTail(array) {return [_.first(array), "/" + _.tail(array).join('/')]; }
    function separateUriHeadAndTail(uri) {return headTail(uri.slice(1).split("/")); }

    function findElement(columnTree, jsonLevel) {
        console.log("columnTree %j", columnTree);
        console.log("jsonLevel %j", jsonLevel);
    }

    function getTableFromJsonLevel(uriData, columnTree, jsonLevel) {
        var headTail = separateUriHeadAndTail(uriData),
            head = headTail[0],
            tail = headTail[1],
            colValues,
            colData;

        console.log("jsonLevel = %j", jsonLevel);

        console.log("head: " + head);

        console.log("tail: " + tail);

        if (tail === "/") {return; }

        if (head === "*") {
            console.log("hit the *");
            console.log("jsonLevel %j", jsonLevel);
            _.each(jsonLevel, function (nextLevelJson) {
                console.log("* iteration tail = " + tail);
                return getTableFromJsonLevel(tail, columnTree["*"], nextLevelJson);
            });
            //iterate over everything
        } else {
            console.log("hit the " + head);

            colValues = _.chain(jsonLevel)
                .pairs()
                .select(function (keyLevelPair) {
                    var key = keyLevelPair[0],
                        level = keyLevelPair[1];
                    console.log("key = %j", key);
                    console.log("level = %j", level);
                    return key !== head;
                })
                .map(function (keyLevelPair) {
                    var key = keyLevelPair[0],
                        level = keyLevelPair[1];

                    console.log("key = %j", key);
                    console.log("level = %j", level);
                    return findElement(columnTree[key], level);
                })
                .flatten()
                .object()
                .value();

            colData = getTableFromJsonLevel(tail, columnTree[head], jsonLevel[head]);
            //add element for each data point returned

            return _.extend(colValues, colData);

        }
    }

    //public functions
    function getTableWithJson(uriData, columnTree) {
        console.log("uriData = ");
        console.log(uriData);
        console.log("columnTree = ");
        console.log(columnTree);

        return getTableFromJsonLevel(uriData, columnTree, jsonData);
    }

    function getTableWithArray(uriArray, columnNameArray) {
        var columnTree = sproutid.uriTree(uriArray, columnNameArray);
        return getTableWithJson(uriArray[0], columnTree);
    }

    return {
        getTableWithJson: getTableWithJson,
        getTableWithArray: getTableWithArray
    };
}

module.exports = {
    name: "squash",
    version: "0.0.1",
    json: jsonFunc
};