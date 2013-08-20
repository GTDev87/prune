/*jslint node: true, nomen: true */
'use strict';

var _ = require('lodash'),
    sproutid = require('sproutid');


function jsonFunc(jsonData) {

    function privateFindElements(jsonDataTree, columnTree) {
        return _.chain(columnTree)
            .pairs()
            .map(function (locationColumnTreePairs) {
                var locKey = locationColumnTreePairs[0],
                    subLocColumnTree = locationColumnTreePairs[1],
                    subColumnTreeType = typeof subLocColumnTree,
                    returnObj = {},
                    privoutput;

                if ("object" === subColumnTreeType) {
                    privoutput = privateFindElements(jsonDataTree[locKey], subLocColumnTree);
                    return privoutput;
                }

                returnObj[subLocColumnTree] = jsonDataTree[locKey];
                return returnObj;
            })
            .reduce(function (combinedObject, obj) {
                return _.extend(combinedObject, obj);
            }, {});
    }

    function getTableFromJsonLevel(uriData, columnTree, jsonLevel) {
        var headTail = sproutid.separateUriHeadAndTail(uriData),
            head = headTail[0],
            tail = headTail[1],
            colValues,
            colData;

        // console.log("uriData = %j", uriData);
        // console.log("columnTree = %j", columnTree);
        // console.log("jsonLevel = %j", jsonLevel);

        // console.log("head: " + head);

        // console.log("tail: " + tail);

        if (tail === "/") {return; }

        //console.log("hit the " + head);
        if (head === "*") {

            //console.log("jsonLevel %j", jsonLevel);
            _.each(jsonLevel, function (nextLevelJson) {
                //console.log("* iteration tail = " + tail);
                return getTableFromJsonLevel(tail, columnTree["*"], nextLevelJson);
            });
            //iterate over everything
        } else {

            colValues = _(jsonLevel)
                .pairs()
                .select(function (keyLevelPair) {
                    var key = keyLevelPair[0];
                        //, level = keyLevelPair[1];
                    // console.log("key = %j", key);
                    // console.log("level = %j", level);
                    return key !== head;
                })
                .map(function (keyLevelPair) {
                    var key = keyLevelPair[0],
                        level = keyLevelPair[1];

                    // console.log("key = %j", key);
                    // console.log("level = %j", level);
                    return privateFindElements(level, columnTree[key]);
                })
                .flatten()
                .object();

            colData = getTableFromJsonLevel(tail, columnTree[head], jsonLevel[head]);
            //add element for each data point returned

            return _.extend(colValues, colData);

        }
    }

    //public functions
    function findElements(columnTree) {return privateFindElements(jsonData, columnTree); }

    function getTableWithJson(uriData, columnTree) {
        // console.log("uriData = %j", uriData);
        // console.log("columnTree = %j", columnTree);

        return getTableFromJsonLevel(uriData, columnTree, jsonData);
    }

    function getTableWithArray(uriArray, columnNameArray) {
        var columnTree = sproutid.uriTree(uriArray, columnNameArray);
        return getTableWithJson(uriArray[0], columnTree);
    }

    return {
        getTableWithJson: getTableWithJson,
        getTableWithArray: getTableWithArray,
        findElements: findElements
    };
}

module.exports = {
    name: "squash",
    version: "0.0.1",
    json: jsonFunc
};