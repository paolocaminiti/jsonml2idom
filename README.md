## Cause DOM ain't nothing but a nested list.

#### No, seriously, why JSONML...
- there's nothing fancy about it, not even the name.
- there's no syntax to learn, no arbitrary semantics overhead either.
- there's no directives, factories, superheroes, added magic or atomic science.

There's literally about nothing to learn here, meaning very little risk of forthcoming obsolescence. The fine art of lists composition has been around forever, jsonml quite a while as well.

Your DOM is expressed by nested arrays as a simple data structure. You can compose it exploiting the full expressiveness of the language, from pure functions to array extras, external libraries, ES6 goodness.

Together with [Incremental DOM](https://github.com/google/incremental-dom) it allows efficient in place DOM mutations, letting UI be a function of state.

##### Live demos
[circles](http://paolocaminiti.github.io/jsonml2idom/demo/circles), benchmark.

[dbmonster](http://paolocaminiti.github.io/jsonml2idom/demo/dbmonster), benchmark.

[primer6](http://paolocaminiti.github.io/jsonml2idom/demo/primer6), *shouldComponentUpdate* equivalent by skipping descendants.

[primer6-webcomponents](http://paolocaminiti.github.io/jsonml2idom/demo/primer6-webcomponents), React like components lifecycle via webcomponents.

##### Basic usage
```javascript
function action(e) {
	var text = e.target.stateRef.text
	console.log(text)
}

function item(i, index) {
	return (
		['li',
 			['div.class-1.class-2', { style: 'color: cyan;' },
      			`item: ${index} `, i.text
    		],
    		['button', { onclick: action, stateRef: i }]
  		]
	)
}

function list(state) {
	return ['ul', ...state.list.map(item)]
}

function app(state) {
	return (
		['#approot', { style: { backgroundColor: 'hotpink' } },
    		['p', 'A list in an app'],
    		list(state)
  		]
	)
}

function update() {
	IncrementalDOM.patch(node, jsonml2idom, app(state))
}
```

##### All there is to know about standard JSONML
- A nested array maps 1:1 to your DOM.
- Each array describes an element.
- The head of each array is by convention the tag name.
- An optional subsequent object will contain key/value pairs for the attributes.
- All following items in the array are children of the element: arrays again for elements, everything else as text nodes.

##### Not standard, in this library
- The *head of the array* accepts css syntax for id and classes 'div#id.class1.class2' and defaults to DIV. Note that dynamic attributes are better declared in the attributes object *{ id: dynamicId, class: dynamicClasses, ... }*.

- Attributes values of type Object or Function will be [assigned as properties](http://google.github.io/incremental-dom/#rendering-dom/attributes-and-properties) of the element.

- *{ key: uniqueKey, ... }* attribute assigns an Incremental DOM key to the element.

- *undefined* values in children positions are just ignored, this simplifies composition by allowing fragment functions to return undefined.

- *Function* in children positions will be called with the currentElement as first argument. This enables hooking during the rendering pass by incremental-dom. It should be used as a least resort (see advanced tricks instead), possibly by just collecting the element reference and defer execution once DOM patching is terminated.

##### Where is *shouldComponentUpdate*?
- *{ skip: true, ... }* on an element will tell Incremental DOM to skip diffing it's descendants and resume traversal. This effectively let's you treat an element as a "component" root that doesn't need any update. Element *key* is mandatory in this case. (See [primer6 demo](http://paolocaminiti.github.io/jsonml2idom/demo/primer6/) for possible usage).

##### Advanced tricks
- A *style* attribute can be assigned both as a string or an object, [an object being mapped directly to style properties](http://google.github.io/incremental-dom/#rendering-dom/applying-styles).

- By assigning objects to element's properties, arbitrary data other than standard properties can be added to any element, this is especially useful in event handling.

- When you want to coerce a string or number to be assigned as a property instead of an attribute create a new instance of it *{ inputValueName: new String(value), ... }*.

- Sometime you'll need to mix static HTML content (ex. ajax content sent by a server) into your JSONML, while you can assign it to the .innerHTML property of a node using the attributes object, you would lose control over it. [Here is a gist](https://gist.github.com/paolocaminiti/df203b27f63debb76378) to convert HTML strings and DOM fragments to JSONML, so that you can have full control of them and get them rendered along the rest of your JSONML by Incremental DOM.

### Learn more
Really that's all there is to learn.

ES6 modules + [Redux](https://github.com/rackt/redux) seem a very good option to go along, allowing scalability while keeping things simple and real. The combo worked very well in production for my company.

I suggest reading the, short, [Incremental DOM documentation](http://google.github.io/incremental-dom/#about) and running one of their small examples in the debugger to get a full picture of what is going on.

[http://www.jsonml.org/](http://www.jsonml.org/) may also be a source of related usefull infos.

### Server side rendering
[Look here for experiments](https://github.com/paolocaminiti/idom2string) in this direction, turns out Incremental DOM API is really simple to map to string output.

### Browser compatibility
Just the same as Incremental DOM itself, which by now seems to target IE9.

### Tests
Once I settle on how to do it properly along with Incremental DOM.

### Opinions
[Link to irrelevant rumblings](https://github.com/paolocaminiti/jsonml2idom/blob/master/OPINIONS.md) about performance and apps' architecture.
