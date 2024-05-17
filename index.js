window.addEventListener('scroll', () => {
    const line = document.querySelector('.line');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Calculate the scroll percentage
    const scrollPercent = (scrollPosition / (docHeight - windowHeight)) * 100;

    // Convert the fixed position 322px to vh
    const pxValue = 322;
    const vhValue = (pxValue / windowHeight) * 100;

    // Calculate the translation value in vh
    const translateValueVH = scrollPercent * (window.innerWidth / 230 / windowHeight * 100) + vhValue;

    // Set the transform property to translate the line horizontally
    line.style.transform = `translateX(${translateValueVH}vh)`;
});

// Variables for audio and scroll timeout
let audioContext;
let audioElement;
let track;
let gainNode;
let scrollTimeout;
const fadeDuration = 0.5; // Duration of the fade-out effect in seconds

// Load the audio context and elements
window.addEventListener('load', () => {
    audioElement = document.getElementById('audio');
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    track = audioContext.createMediaElementSource(audioElement);
    gainNode = audioContext.createGain();
    track.connect(gainNode).connect(audioContext.destination);
});

// Scroll event listener
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollPercent = (scrollPosition / (docHeight - windowHeight)) * 100;

    // Play audio if scroll percentage is less than 50
    if (scrollPercent < 75) {
        document.getElementById('line').classList.add('fadein');
        document.getElementById('line').classList.remove('fadeout');
        if (audioElement) {
            audioElement.play();
            gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Ensure volume is at max when starting

            // Clear the previous timeout to reset the timer
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Set a new timeout to fade out and stop the audio after 5 seconds
            scrollTimeout = setTimeout(fadeOutAudio, 500);
        }
    } else {
        document.getElementById('line').classList.remove('fadein');
        document.getElementById('line').classList.add('fadeout');
    }
});

// Function to fade out audio
function fadeOutAudio() {
    gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Start from full volume
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration); // Fade to 0 over fadeDuration seconds

    setTimeout(() => {
        audioElement.pause();
        audioElement.currentTime = 0; // Reset audio to start
    }, fadeDuration * 1000); // Wait for the fade-out to complete before pausing
}