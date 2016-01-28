// state transitions
var transformers = {
	list: {
		addItem: function () {
			var ref = randomItem()
			state.items.push(ref)
			up.batch(ref)
		},
		addMany: function () {
			for (var i = 0; i < state.menu.addManyCount; i++) transformers.list.addItem()
			up.batch(state.menu)
		},
		flush: function (e) {
			state.items = []
			up.batch(state.menu)
		},
		addManyCount: function (e) {
			var value = e.target.value
			state.menu.addManyCount = value
			up.batch(state.menu)
		}
	},
	item: {
		remove: function (e) {
			var ref = e.target.ref
			var item = state.items[0]
			state.items.splice(state.items.indexOf(ref), 1);
			up.batch()
		},
		colorChange: function (e) {
			var ref = e.target.ref
			var value = e.target.value
			ref.color = value
			up.batch(ref)
		},
		widthChange: function (e) {
			var ref = e.target.ref
			var value = e.target.value
			ref.width = value
			up.batch(ref)
		}
	},
	state: {
		__animateInterval: null,
		animate: function (e) {
			if (transformers.state.__animateInterval) {
				clearInterval(transformers.state.__animateInterval)
				transformers.state.__animateInterval = null
			} else {
				transformers.state.__animateInterval = setInterval(function () {
					var index;
					var ref;
					index = Math.round(Math.random() * state.items.length)
					ref = state.items[index]
					if (ref) {
						ref.width = Math.round(Math.random() * 1000)
						//ref.color = '#' + Math.random().toString(16).substr(-6)
						up.batch(ref)
					}
					// always animate head for fps counter
					ref = state.items[0]
					if (ref) {
						ref.width = Math.round(Math.random() * 1000)
						//ref.color = '#' + Math.random().toString(16).substr(-6)
						up.batch(ref)
					}
				}, 0)
			}
		},
		flush: function () {
			__persistState = false
			delete localStorage.state
		}
	}
}