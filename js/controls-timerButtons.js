// button.plus and .minus in .timingControls > .workTimer and. breakTimer

const workPlus = document.querySelector('.workTimer > .plus');
const workMinus = document.querySelector('.workTimer > .minus');

const breakPlus = document.querySelector('.breakTimer > .plus');
const breakMinus = document.querySelector('.breakTimer > .minus');

let multiplier = 1;

document.addEventListener("keydown", function (e) {
	// keyCode 16 = SHIFT
	if(e.keyCode === 16) {
		console.log("SHIFT PRESSED");
		multiplier = 5;
	}
});
document.addEventListener("keyup", function(e) {
	if(e.keyCode === 16) {
		console.log("SHIFT RELEASED");
		multiplier = 1;
	}
});

function workIncrement() {
	eventDispatcher.emit('work-timer:++', multiplier);
}
function workDecrement() {
	eventDispatcher.emit('work-timer:--', multiplier);
}

function breakIncrement() {
	console.log("breakincr");
	eventDispatcher.emit('break-timer:++', multiplier);
}
function breakDecrement() {
	eventDispatcher.emit('break-timer:--', multiplier);
}

function repeatFunction(repeatF, freq = 200) {
	let intervalId;
	function start() {
		repeatF();
		intervalId = setInterval(repeatF, freq);
	}
	function stop() {
		clearInterval(intervalId);
	}

	return {start, stop};
}

function connectButtonOnOff(btn, {start, stop}) {
	btn.addEventListener('mousedown', start);
	btn.addEventListener('mouseup', stop);
	btn.addEventListener('mouseleave', stop);
}

const workIncrementRepeat = repeatFunction(workIncrement);
const workDecrementRepeat = repeatFunction(workDecrement);

const breakIncrementRepeat = repeatFunction(breakIncrement);
const breakDecrementRepeat = repeatFunction(breakDecrement);


connectButtonOnOff(workPlus, workIncrementRepeat);
connectButtonOnOff(workMinus, workDecrementRepeat);

connectButtonOnOff(breakPlus, breakIncrementRepeat);
connectButtonOnOff(breakMinus, breakDecrementRepeat);


function connectKeydown(btn, fn) {
	btn.addEventListener('keydown', function(e) {
		// keyCode 32 = space, 13 = Enter, 16 = Shift
		if(e.keyCode === 32 || e.keyCode === 13) {
			fn();
		}
	});
}

connectKeydown(workPlus, workIncrement);
connectKeydown(workMinus, workDecrement);

connectKeydown(breakPlus, breakIncrement);
connectKeydown(breakMinus, breakDecrement);

function disableBtn(disable, btnName) {
	if(btnName === "work") {
		workPlus.disabled = disable;
		workMinus.disabled = disable;

		// stop incr/decrementing if in progress
		workIncrementRepeat.stop();
		workDecrementRepeat.stop();

	}else if (btnName === "break") {
		breakPlus.disabled = disable;
		breakMinus.disabled = disable;

		// stop incr/decrementing if in progress
		breakIncrementRepeat.stop();
		breakDecrementRepeat.stop();
	}
}


eventDispatcher.on('timer:state-changed', ({currentState, session: {name: sessionName}}) => {
	disableBtn(currentState === "active", sessionName);
});
eventDispatcher.on('timer:session-changed', ({ended: {session: {name: endedSessionName}}, started: {session: {name: startedSessionName}}}) => {
	disableBtn(false, endedSessionName);
	disableBtn(true, startedSessionName);
});
