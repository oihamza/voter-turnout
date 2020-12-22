let margin = { top: 0, right: 0, bottom: 0, left: 0 },
	width = 900 - margin.left - margin.right,
	height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3
	.select('#treemap')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
// Read data
d3.csv('stateVoterTurnout.csv', function (data) {
	// stratify the data: reformatting for d3.js
	var root = d3
		.stratify()
		.id(function (d) {
			return d.name;
		}) // Name of the entity (column name is name in csv)
		.parentId(function (d) {
			return d.parent;
		})(
		// Name of the parent (column name is parent in csv)
		data
	);

	// data is an object
	console.log(data);

	// let values = data[1].value;

	// console.log(values);

	let tooltip = d3
		.select('body')
		.append('div')
		.style('position', 'absolute')
		.style('z-index', '10')
		.style('visibility', 'hidden')
		.style('background-color', 'white')
		.style('border', 'solid')
		.style('border-width', '2px')
		.style('border-radius', '5px')
		.style('padding', '5px');

	root.sum(function (d) {
		return +d.value;
	}); // Compute the numeric value for each entity

	// Then d3.treemap computes the position of each element of the hierarchy
	// The coordinates are added to the root object above
	d3.treemap().size([width, height]).padding(3)(root);

	console.log(root.leaves());
	// use this information to add rectangles:

	svg
		.selectAll('rect')
		.data(root.leaves())
		.enter()
		.append('rect')
		.attr('x', function (d) {
			return d.x0;
		})
		.attr('y', function (d) {
			return d.y0;
		})
		.attr('width', function (d) {
			return d.x1 - d.x0;
		})
		.attr('height', function (d) {
			return d.y1 - d.y0;
		})
		.style('stroke', 'black')
		.style('fill', '#945f04')

		.on('mouseover', function () {
			tooltip.style('visibility', 'visible');
		})
		.on('mousemove', function (d) {
			tooltip
				.style('top', d3.event.pageY - 10 + 'px')
				.style('left', d3.event.pageX + 10 + 'px')
				.text(
					`${d.data.value} people voted. ${d.data.electoral} electoral votes for ${d.data.name} went to the ${d.data.party} party.`
				);
		})

		.on('mouseout', function () {
			tooltip.style('visibility', 'hidden');
		});

	// and to add the text labels

	svg
		.selectAll('text')
		.data(root.leaves())
		.enter()
		.append('text')
		.attr('x', function (d) {
			return d.x0 + 10;
		}) // +10 to adjust position (more right)
		.attr('y', function (d) {
			return d.y0 + 20;
		}) // +20 to adjust position (lower)
		.text(function (d) {
			return d.data.name;
		})
		.attr('font-size', '15px')
		.attr('fill', 'white');
});

// d3.csv('watchDataTable.csv').then((data) => {
// 	console.log('data', data);

// 	// select the `table` container in the HTML
// 	const table = d3.select('#d3-table');

// 	/** HEADER */
// 	const thead = table.append('thead');
// 	thead
// 		.append('tr')
// 		.style('background', 'Orange')
// 		.style('text-align', 'center')
// 		.selectAll('th')
// 		.data(data.columns)
// 		.join('td')
// 		.text((d) => d);

// 	/** BODY */
// 	const rows = table
// 		.append('tbody')
// 		.style('background', 'lightGray')
// 		.style('text-align', 'center')
// 		.selectAll('tr')
// 		.data(data)
// 		.join('tr');

// 	// cells
// 	rows
// 		.selectAll('td')
// 		.data((d) => Object.values(d))
// 		.join('td')
// 		// update the below logic to apply to your dataset
// 		.style('background-color', (d) => (d > 7.5 ? 'lightgreen' : null))
// 		.text((d) => d);
// });

// // end of table
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// // start of treemap
