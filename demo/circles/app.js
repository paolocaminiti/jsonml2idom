'use strict';

// Change N to change the number of drawn circles.
var N = 1000;

function setN (target) {
	N = parseInt(target.value) || 1
}

//benchmark
var timeout, totalTime, loopCount;
var timingOutput;

var benchmarkLoop = function (fn) {
	var startDate = new Date();
	fn();
	var endDate = new Date();
	totalTime += endDate - startDate;
	loopCount++;
	if (loopCount % 20 === 0) {
		timingOutput.text('Performed ' + loopCount + ' iterations in ' + totalTime +
											' ms (average ' + (totalTime / loopCount).toFixed(2) + ' ms per loop).');
	}
	timeout = _.defer(benchmarkLoop, fn);
};

var reset = function() {
	$('#grid').empty();
	$('#timing').html('&nbsp;');
	timingOutput = $('#timing')
	clearTimeout(timeout);
	loopCount = 0;
	totalTime = 0;
};

// The React implementation:
(function(){'use strict';
	var BoxView = React.createClass({
		render: function() {
			var count = this.props.count + 1;
			return (
				React.DOM.div(
					{className: "box-view"},
					React.DOM.div(
						{
							className: "box",
							style: {
								top: Math.sin(count / 10) * 10,
								left: Math.cos(count / 10) * 10,
								background: 'rgb(0, 0,' + count % 255 + ')'
							}
						},
						count % 100
					)
				)
			);
		}
	});

	var range;

	var BoxesView = React.createClass({
		render: function() {
			var boxes = range.map(function(i) {
				return BoxView({key: i, count: this.props.count});
			}, this);
			return React.DOM.div(null, boxes);
		}
	});

	var counter;
	var reactInit = function() {
		range = _.range(N);
		counter = -1;
		reactAnimate();
	};

	var reactAnimate = function() {
		React.renderComponent(
			BoxesView({count: counter++}),
			document.getElementById('grid')
		);
	};

	window.runReact = function() {
		reset();
		reactInit();
		benchmarkLoop(reactAnimate);
	};
})();

// rawdog
(function(){'use strict';
	var BoxView = function(number){
		this.el = document.createElement('div');
		this.el.className = 'box-view';
		this.el.innerHTML = '<div class="box" id="box-' + number + '"></div>';
		this.count = 0;
		this.render();
	};

	BoxView.prototype.render = function(){
		var count = this.count;
		var el = this.el.firstChild;
		el.style.top = Math.sin(count / 10) * 10 + 'px';
		el.style.left = Math.cos(count / 10) * 10 + 'px';
		el.style.background = 'rgb(0,0,' + count % 255 + ')';
		el.textContent = String(count % 100);
	};

	BoxView.prototype.tick = function(){
		this.count++;
		this.render();
	};

	var boxes;

	var init = function() {
		boxes = _.map(_.range(N), function(i) {
			var view = new BoxView(i);
			$('#grid').append(view.el);
			return view;
		});
	};

	var animate = function() {
		for (var i = 0, l = boxes.length; i < l; i++) {
		boxes[i].tick();
		}
	};

	window.runRawdog = function() {
		reset();
		init();
		benchmarkLoop(animate);
	};
})();

// Incremental DOM
(function(){
	var state
	var container

	var elementOpen = IncrementalDOM.elementOpen;
	var elementClose = IncrementalDOM.elementClose;
	var elementVoid = IncrementalDOM.elementVoid;
	var text = IncrementalDOM.text;
	var patch = IncrementalDOM.patch;

	function init() {
		state = {
			boxes: []
		}
		for (var i = 0; i < N; i++) state.boxes.push({ count: 0 })
		container = window.document.getElementById('grid')
	}

	var handlers = {}

	var boxViewStatics = ['class', 'box-view']
	var boxStatics = ['class', 'box']

	function box(i, index) {
		var count = i.count
		var boxStyle = 'top: ' + (Math.sin(count / 10) * 10) + 'px; left: ' + (Math.cos(count / 10) * 10) + 'px; background: rgb(0, 0,' + (count % 255) + ')'
		elementOpen('div', index, boxViewStatics)
			elementOpen('div', null, boxStatics, 'style', boxStyle)
				text(count % 100)
			elementClose('div')
		elementClose('div')
	}

	function render(s) {
		//elementOpen('div')
			s.boxes.map(box)
		//elementClose('div')
	}

	function update() {
		patch(container, render, state)
	}

	function tick(b) {
		b.count++
	}

	function animate() {
		var boxes = state.boxes
		for (var i = 0, l = boxes.length; i < l; i++) tick(boxes[i])
		update()
	}

	window.runIncDOM = function() {
		reset();
		init();
		benchmarkLoop(animate);
	};
})();

// incrementalDOM jsonml
(function(){
	var state
	var container

	var patch = IncrementalDOM.patch

	function init() {
		state = {
			boxes: []
		}
		for (var i = 0; i < N; i++) state.boxes.push({ count: 0 })
		container = window.document.getElementById('grid')
	}

	function box(i, index) {
		var count = i.count
		var boxStyle = 'top: ' + (Math.sin(count / 10) * 10) + 'px; left: ' + (Math.cos(count / 10) * 10) + 'px; background: rgb(0, 0,' + (count % 255) + ')'
		return ['div.box-view', { key: index },
					['div.box', { style: boxStyle },
						count % 100
					]
				]
	}

	function app(s) {
		return ['span'].concat(s.boxes.map(box))
	}

	function render(s) {
		jsonml(app(s))
	}

	function update(data) {
		patch(container, render, state)
	}

	function tick(b) {
		b.count++
	}

	function animate() {
		var boxes = state.boxes
		for (var i = 0, l = boxes.length; i < l; i++) tick(boxes[i])
		update()
	}

	window.runJSONML = function() {
		reset();
		init();
		benchmarkLoop(animate);
	}
})();
