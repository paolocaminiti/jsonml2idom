### Opinions

##### About this library
All this library does is making the relevant Incremental DOM calls while traversing the JSONML DOM description.

At around 50 loc not only it's lightweight (Incremental DOM itself is < 10kb), it's easily hackable to tailor around any specific needs you may encounter in your projects, instead of resorting on weird workarounds.

There are lots of ways to use Incremental DOM methods, I tried out many, the code published here is and will be changed according to the simplest and most performant I can come with.

##### What's it good for?
This library has no opinions about code architecture, so probably shouldn't be your pick for the next big monster project that will try to fire back at you as soon as you release it.

If you have a small project, or simply don't make monsters, like to have full control of your code architecture with a bit of third party libraries and much vanilla on top, then you can give it a try: especially in small projects, coding without big mysterious dependencies can be a refreshing experience.

Personally I used standard JSONML for a long time to develop browser extensions, where you want to load as little dependencies as possible, adding Incremental DOM to the mix now allows far better reasoning and far simpler architecture.

Again, ES6 modules + [Redux](https://github.com/rackt/redux) seem a very good option.

##### Performance considerations
Talking raw frame rate, the demos provided sit few fps behind hand coded incremental dom implementations. Performance can be made even closer by assigning some attributes, like the id and class from the tag definition, as Incremental DOM static properties, unfortunately right now this would mean providing a key for each element created with static properties (this is something the Incremental DOM team seems to be addressing, this library will be updated as soon as it gets stable).

That said performance is not so much of a deal, we are not doing videogames here and all demos presented are mere exagerations (dbmonster is updating 4600 elements per frame). Thanks to Incremental DOM the result is already excellent for real world web apps, in many cases ahead of far more complex libraries around.

What's really interesting is that memory behaves very well too, the array describing the dom is an easy target for GC and the memory footprint of the running demos stays stable, perfectly in line with the hand coded counterparts.

The transpiled approaches generating the Incremental DOM code from templating languages at build time will always have the last word here, but unless you're constrained by extreme performance/memory limitations this should not be of any concern.

##### Incremental DOM is still experimental
The stability of the JSONML format somewhat protects from Incremental DOM experimental status. Still things like *_key*, *_skip*, *statics/dynamic properties* assignment, and eventual new features or better understanding may vary this repo.

##### Compatibility with standard JSONML code
Only one attributes object at position 1 of the element's array is allowed. Standard JSNOML doesn't specify this, so [most parsers](https://gist.github.com/paolocaminiti/a828900d1e9dad44f97b) will allow multiple attributes objects to be scattered anywhere after the head. Implementing this with Incremental DOM would be a performance hit on long child lists, and frankly I never used it.

Overall introducing this library into an existing code base should be straightforward, although its real benefits will only come refactoring app architecture to a more declarative style, which is another matter.

##### Routing
Personally, I believe client side routing is a very broken metaphor. All we do on the client is extract properties from the hash to determine the state for our app. Just listen for the hash change, extract your parameters as freely as you need, map them to your app state and exploit them as conditions in you fragments functions. Other than easy, this allows great flexibility, like mantaining state of multiple parallel fragments with [multidimensional notation](http://www.w3.org/DesignIssues/MatrixURIs.html).

##### Further
JSONML is a fully serializable format sitting between you intentions and real DOM rendering. This means it can be composed in a separate thread. My own experience showed web workers never pay off when it comes to such a fast process like generating a full UI. But this opens the way to service workers as well as to UI being rendered by an Incremental DOM equivalent on a mobile native thread.

##### Yes, but seriously, why JSONML...
Because [we should have gone lists data structures and S-expressions from the very beginning of this XML thing] (http://www-formal.stanford.edu/jmc/slides/wrong/wrong-sli/wrong-sli.html) :)
