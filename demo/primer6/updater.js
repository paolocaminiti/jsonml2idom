// naif update mechanic
function Updater(update) {
	function _checkPendingUpdate_initialRender(stateRef) {
		return true
	}

	function _checkPendingUpdate_standard(stateRef) {
		return _pendingUpdates.indexOf(stateRef) !== -1
	}

	function _run_initialRender() {
		_run_standard()
		_checkPendingUpdate = _checkPendingUpdate_standard
		_run = _run_standard
	}

	function _run_standard() {
		_update()
		_updateAnimationFrame = undefined
		flush()
	}

	function _requestUpdate() {
		if (!_updateAnimationFrame) {
			_updateAnimationFrame = requestAnimationFrame(_run)
		}
	}

	function batch(stateRef) {
		if (stateRef && !_checkPendingUpdate(stateRef)) {
			_pendingUpdates.push(stateRef)
		}
		_requestUpdate()
	}

	function cancel() {
		cancelAnimationFrame(_updateAnimationFrame)
	}

	function check(stateRef) {
		return _checkPendingUpdate(stateRef)
	}

	function flush() {
		_pendingUpdates = []
	}

	function run() {
		_run()
	}

	var _pendingUpdates = []
	var _checkPendingUpdate = _checkPendingUpdate_initialRender
	var _run = _run_initialRender
	var _updateAnimationFrame = undefined
	var _update = update

	return {
		batch: batch,
		cancel: cancel,
		check: check,
		flush: flush,
		run: run
	}
}