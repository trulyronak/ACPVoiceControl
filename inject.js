// todo: look into using https://github.com/duo-labs/chrome-extension-boilerplate ACPVoiceControl

const createTextToSpeech = () => {
	// Initialize new SpeechSynthesisUtterance object
	window.speech = new SpeechSynthesisUtterance();
	
	const speech = window.speech;

	// Set Speech Language
	speech.lang = "en";
	
	let voices = []; // global array of available voices
	
	window.speechSynthesis.onvoiceschanged = () => {
	  // Get List of Voices
	  voices = window.speechSynthesis.getVoices();
	
	  // Initially set the First Voice in the Array.
	  speech.voice = voices[0];
	
	  // Set the Voice Select List. (Set the Index as the value, which we'll use later when the user updates the Voice using the Select Menu.)
	  let voiceSelect = document.querySelector("#voices");
	  voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
	};
}


const createSpeechToText = () => {
	// new speech recognition object
	window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
	window.recognition = new window.SpeechRecognition();

	const recognition = window.recognition;

	// This runs when the speech recognition service starts
	recognition.onstart = function() {
		console.log("We are listening. Try speaking into the microphone.");
	};

	recognition.onspeechend = function() {
		// when user is done speaking
		recognition.stop();
		console.log('no longer listening')
	}
				
	// This runs when the speech recognition service returns result
	recognition.onresult = function(event) {
		var transcript = event.results[0][0].transcript || "no data";
		var confidence = event.results[0][0].confidence;

		console.log(transcript);
		if (transcript.includes("read question")) {
			readQuestion();
		} else if (transcript.includes("read answers")) {
			readAnswers();
		} else if (transcript.includes("select option")) {
			selectAndSubmitOption(transcript.split("select option")[0]);
		} else if (transcript.includes("read correct answer")) {
			readCorrectAnswer();
		} else if (transcript.includes("go to next")) {
			goToNextQuestion();
		} else if (transcript.includes("go to previous")) {
			goToPreviousQuestion();
		} else if (transcript.includes("help")) {
			const text = (`commands: "read question"
			"read answers"
			"select option"
			"read correct answer"
			"go to next"
			"go to previous"
			"help"`)
			speak(text);
			console.log(text);
		} else {
			const text = `No command found. To hear a list of commands, say "help". We heard you say ${transcript}.`
			speak(text);
			console.log(text);
		}
	};
}

document.addEventListener('keydown', (e) => {
	if (e.keyCode === 32) { // space
		window.recognition.start();
	}
});

const speak = (text) => {
	window.speechSynthesis.cancel();
	window.speech.text = text;
	window.speechSynthesis.speak(window.speech);
}

// Read questions

const readQuestion = () => {
	const infoArea = document.getElementsByClassName("q_info")[0];

	const content = infoArea.getElementsByTagName("p");
	let data = "";
	for (const elem of content) {
		data += elem.innerText + " ";
	}
	console.log(data);
	speak(data);
}

// Read answers
const readAnswers = () => {
	const answerArea = document.getElementsByClassName("q_mcq")[0];

	const prompt = "prompt: " + answerArea.getElementsByClassName("header")[0].innerText;
	const options = answerArea.getElementsByClassName("option");
	let optionText = "";
	for (const option of options) {
		optionText += option.innerText + " ";
	}
	
	const text = prompt + "Your options are: " + optionText;

	speak(text);

	console.log(text)
}

// Select and submit answer
const selectAndSubmitOption = (optionString) => {
	const answerArea = document.getElementsByClassName("q_mcq")[0];

	const options = answerArea.getElementsByTagName("input");
	for (const option of options) {
		if (option.value === optionString) {
			option.click();
		}
	}

	const correctAnswer = document.getElementsByClassName("answer")[0].getElementsByTagName("h4")[0].innerText;
	const text = `Submitted option ${optionString}. The correct answer is ${correctAnswer}`;
	speak(text);
	console.log(text)
}

// Read correct answer
const readCorrectAnswer = () => {
	const correctAnswer = document.getElementsByClassName("answer")[0].getElementsByTagName("h4")[0].innerText;
	const text = `The correct answer is ${correctAnswer}`;
	speak(text);
	console.log(text)
}

// Go to next question
const goToNextQuestion = () => {
	const bottomBar = document.getElementsByClassName("pagination-content")[0].children;
	bottomBar[bottomBar.length - 1].getElementsByTagName("a")[0].click();
	speak("navigated to the next question");
}

// go to previous question
const goToPreviousQuestion = () => {
	const bottomBar = document.getElementsByClassName("pagination-content")[0].children;
	bottomBar[0].getElementsByTagName("a")[0].click();
	speak("navigated to the prior question");
}

createTextToSpeech();
createSpeechToText();