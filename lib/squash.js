/*jslint nomen: true */
'use strict';

var _ = require('underscore');


exports.json = function (jsonData) {

	function headTail(array) {return [_.first(array), "/" + _.tail(array).join('/')]; }

	function separateUriHeadAndTail(uri) {return headTail(uri.slice(1).split("/")); }

	function combineArrayLocationLabels(locationLabelArray) {
		return _.reduce(
			locationLabelArray,
			function (aggHistogramTree, locationLabel) {
				var location = locationLabel[0],
					locLabel = locationLabel[1];
				if (aggHistogramTree[location] === undefined) {aggHistogramTree[location] = []; }
				aggHistogramTree[location].push(locLabel);
				return aggHistogramTree;
			},
			{}
		);
	}

	//private functions
	function uriLabelsIntoColumnTree(uriLabelsObject) {
		var uriArrayTree,
			locationLabelArray;

		locationLabelArray = _.chain(uriLabelsObject)
			.pairs()
			.map(function (uriLabel) {
				var uri = uriLabel[0],
					label = uriLabel[1],
					headTail;
				if (uri[0] !== '/') {throw "no slash"; }
				headTail = separateUriHeadAndTail(uri);

				return [headTail[0], [headTail[1], label]];
			})
			.value();

		uriArrayTree = combineArrayLocationLabels(locationLabelArray);

		return _.chain(uriArrayTree)
			.pairs()
			.reduce(
				function (aggTree, locationUriArray) {

					var newLocationLabels = _.object(locationUriArray[1]);

					if (newLocationLabels["/"] !== undefined) {
						aggTree[locationUriArray[0]] = newLocationLabels["/"];
					} else {
						aggTree[locationUriArray[0]] = uriLabelsIntoColumnTree(newLocationLabels);
					}

					return aggTree;
				},
				{}
			)
			.value();
	}

	function getTableFromJsonLevel(uriData, columnTree, jsonLevel){
		_.chain(columnTree)
			.pairs()
			.each(
				function(locationPropertyPair){
				var location = locationPropertyPair[0];
				var property = locationPropertyPair[1];


				var uriHeadTail = separateUriHeadAndTail(uriData);
				var dataHead = uriHeadTail[0];
				var dataTail = uriHeadTail[1];

				console.log("location");
				console.log(location);
				console.log("property");
				console.log(property);

				if (location === "*" && dataHead === "*") {
					jsonLevel
						.pairs()
						.each(
							function(nextLocationPropertyPair){
								var nextLocation = nextLocationPropertyPair[0];
								var nextProperty = nextLocationPropertyPair[1];

								getTableWithJson()
							})
						.value();

					getTableWithJson(, property)
				} else {
					jsonLevel[location];
				}
			
		});
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
		var columnTree = uriLabelsIntoColumnTree(_.object(uriArray, columnNameArray));
		return getTableWithJson(uriArray[0], columnTree);
	}

	return {
		getTableWithJson: getTableWithJson,
		getTableWithArray: getTableWithArray
	};
};