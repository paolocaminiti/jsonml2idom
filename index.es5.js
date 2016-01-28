var jsonml = (function () {
	"use strict";

	var elementOpenStart = IncrementalDOM.elementOpenStart
	var elementOpenEnd = IncrementalDOM.elementOpenEnd
	var elementClose = IncrementalDOM.elementClose
	var skip = IncrementalDOM.skip
	var attr = IncrementalDOM.attr
	var text = IncrementalDOM.text

	function _openTag(head, _key) {
		var dotSplit = head.split('.')
		var hashSplit = dotSplit[0].split('#')

		var tagName = hashSplit[0] || 'div'
		var id = hashSplit[1]
		var className = dotSplit.slice(1).join(' ')

		elementOpenStart(tagName, _key)
		if (id) attr('id', id)
		if (className) attr('class', className)

		return tagName
	}

	function _applyAttrsObj(attrsObj) {
		for (var k in attrsObj) {
			if (k === '_key' || k === '_skip') continue
			attr(k, attrsObj[k])
		}
	}

	function _jsonml(markup) {
		var head = markup[0]
		var attrsObj = markup[1]
		var hasAttrs = attrsObj && attrsObj.constructor === Object
		var firstChildPos = hasAttrs ? 2 : 1
		var _key = hasAttrs && attrsObj._key
		var _skip = hasAttrs && attrsObj._skip

		var tagName = _openTag(head, _key)

		if (hasAttrs) _applyAttrsObj(attrsObj)

		elementOpenEnd()

		if (_skip) {
			skip()
		} else {
			for (var i = firstChildPos, len = markup.length; i < len; i++) {
				var node = markup[i]

				if (!node) continue

				if (Array.isArray(node)) {
					_jsonml(node)
				} else {
					text(node)
				}
			}
		}

		elementClose(tagName)
	}

	return _jsonml
})();
