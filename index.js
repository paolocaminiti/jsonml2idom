import {
	elementOpenStart,
	elementOpenEnd,
	elementClose,
	currentElement,
	skip,
	attr,
	text
} from 'incremental-dom'

function openTag(head, keyAttr) {
	let dotSplit = head.split('.')
	let hashSplit = dotSplit[0].split('#')

	let tagName = hashSplit[0] || 'div'
	let id = hashSplit[1]
	let className = dotSplit.slice(1).join(' ')

	elementOpenStart(tagName, keyAttr)

	if (id) attr('id', id)
	if (className) attr('class', className)

	return tagName
}

function applyAttrsObj(attrsObj) {
	for (let k in attrsObj) {
		attr(k, attrsObj[k])
	}
}

function parse(markup) {
	let head = markup[0]
	let attrsObj = markup[1]
	let hasAttrs = attrsObj && attrsObj.constructor === Object
	let firstChildPos = hasAttrs ? 2 : 1
	let keyAttr = hasAttrs && attrsObj.key
	let skipAttr = hasAttrs && attrsObj.skip

	let tagName = openTag(head, keyAttr)

	if (hasAttrs) applyAttrsObj(attrsObj)

	elementOpenEnd()

	if (skipAttr) {
		skip()
	} else {
		for (let i = firstChildPos, len = markup.length; i < len; i++) {
			let node = markup[i]

			if (node === undefined) continue

			switch (node.constructor) {
				case Array:
					parse(node)
					break
				case Function:
					node(currentElement())
					break
				default:
					text(node)
			}
		}
	}

	elementClose(tagName)
}

export default parse
