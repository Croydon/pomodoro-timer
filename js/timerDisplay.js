// .tomatoTimer > .svgSpace #minutesSvg

const minutesSvg = document.getElementById('minutesSvg');

let minutesSvgValue = minutesSvg.textContent;

minutesSvg.addEventListener('transitionend', function() {
	this.textContent = minutesSvgValue;
	this.classList.remove('changing');
});

function disableTransitionEffect(disable = true) {
	minutesSvg.style.cssText = disable ? "stroke-dashoffset: 0; transition: none;" : "";
}

function changeMinuteSvg(hourAndMin) {
	if(minutesSvgValue === hourAndMin) return;

	disableTransitionEffect(false);

	minutesSvgValue = hourAndMin;
	minutesSvg.classList.add('changing');
}

function setImmediateMinuteSvg(hourAndMin) {
	disableTransitionEffect();

	minutesSvgValue = hourAndMin;
	minutesSvg.textContent = hourAndMin;
}

eventDispatcher.on('minutes-left', changeMinuteSvg);


// .tomatoTimer > .svgSpace #secondsLeft, .tomatoTimer > .seconds

const secondsLeftCircle = document.getElementById('secondsLeft');

const r = parseInt(secondsLeftCircle.getAttribute("r"), 10);
const fct = Math.round(r * 6.285714286)/100;

function changeCircleDashOffset(secondsLeft) {
	let val = 100 - secondsLeft * 5 / 3;
	secondsLeftCircle.style["stroke-dashoffset"] = -fct * val;
}

eventDispatcher.on('seconds-left', changeCircleDashOffset);

const secondsLeftText = document.querySelector('.tomatoTimer > .seconds');

eventDispatcher.on('seconds-left', (seconds) => {
	secondsLeftText.textContent = seconds;
});

eventDispatcher.on('check-clock-seconds:changed', (on) => {
	secondsLeftCircle.classList.toggle('visible', on);
	secondsLeftText.classList.toggle('visible', on);
});

function setSecondsDisplay(seconds, lastMinute) {
	changeCircleDashOffset(!lastMinute && seconds === 0 ? 60 : seconds);
	secondsLeftText.textContent = ":" + seconds;
}


// #minutesSvg, #secondsLeft, .tomatoTimer > .seconds

function secondsToHMinSec(seconds) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor(seconds % 3600 / 60);
	const s = Math.floor(seconds % 3600 % 60);

	return {h, m, s};
}

eventDispatcher.on('timer:session-modified', ({modification: {valueName, newValue: seconds}, isCurrentSession}) => {
	// only processes modifications for values of len of currenSession
	if(valueName !== "len" || !isCurrentSession) return;
	const {h, m, s} = secondsToHMinSec(seconds);

	const hAndMin = h >= 1 ? `${h}:${m}` : m;

	setImmediateMinuteSvg(hAndMin);
	console.log("setting hAndMin", hAndMin, ", sec", s);
	setSecondsDisplay(s, m === 0);
});

eventDispatcher.on('timer:session-in-progress', ({session: {left: seconds}}) => {
	console.log("received seconds", seconds);
	const {h, m, s} = secondsToHMinSec(seconds);

	const hAndMin = h >= 1 ? `${h}:${m}` : m;

	changeMinuteSvg(hAndMin);
	console.log("setting hAndMin", hAndMin, ", sec", s);
	setSecondsDisplay(s, m === 1);
});
