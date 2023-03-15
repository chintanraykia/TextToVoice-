// Find textarea, voicelist, and voiceBtn elements
const textarea = document.querySelector("textarea"),
  voiceList = document.querySelector("select"),
  voiceButton = document.querySelector("button"),
  saveButton = document.querySelector("#save"),
  loadButton = document.querySelector("#load");

// Set up the voice synthesis object and flag for pause/resume voice
let synth = speechSynthesis,
  isPaused = false;

// Dropdown for voice selection with available voices
function voices() {
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  }
}

// Call the voices function when voices change
synth.addEventListener("voiceschanged", voices);

// Convert text to voice
function textToVoice(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voiceList.value) {
      utterance.voice = voice;
    }
  }
  // voiceButton text to Text to Voice when voice is finished
  utterance.onend = () => {
    voiceButton.innerText = "Text to Voice";
  };
  // Speak text with selected voice
  synth.speak(utterance);
}

// Call the textToVoice function when voiceButton is clicked
voiceButton.addEventListener("click", (e) => {
  e.preventDefault();
  // Only speak when textarea is not null
  if (textarea.value !== "") {
    // If voice is not in process, start speaking
    if (!synth.speaking) {
      textToVoice(textarea.value);
      voiceButton.innerText = "Pause";
      // If voice is in process, pause or resume
    } else {
      if (!isPaused) {
        synth.pause();
        isPaused = true;
        voiceButton.innerText = "Resume";
      } else {
        synth.resume();
        isPaused = false;
        voiceButton.innerText = "Pause";
      }
    }
  }
});

// Call textToVoice function again when different voice is selected
voiceList.addEventListener("change", (e) => {
  let selectedVoice = e.target.value;
  // Find selected voice and speak again with that voice
  for (let voice of synth.getVoices()) {
    if (voice.name === selectedVoice) {
      synth.cancel(); // stop speaking with the old voice
      if (isPaused) {
        voiceButton.innerText = "Pause";
      }
      textToVoice(textarea.value); // speak again with the new selected voice
      break;
    }
  }
});

// Save the current text in the textarea to localStorage
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("savedText", textarea.value);
});

// Load the saved text from localStorage and populate the textarea
loadButton.addEventListener("click", (e) => {
  e.preventDefault();
  const savedText = localStorage.getItem("savedText");
  if (savedText) {
    textarea.value = savedText;
  }
});
