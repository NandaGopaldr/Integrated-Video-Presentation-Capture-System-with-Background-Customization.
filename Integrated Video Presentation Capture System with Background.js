const video = document.getElementById('video');
const addContentButton = document.getElementById('add-content-btn');
const contentInput = document.getElementById('content-input');
const recordButton = document.getElementById('record-btn');
const pauseButton = document.getElementById('pause-btn');
const playButton = document.getElementById('play-btn');
const stopButton = document.getElementById('stop-btn');

let contentCounter = 1;
let mediaRecorder;
let recordedChunks = [];

// Access the camera with video and audio
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = 'video.webm';
            a.click();
            window.URL.revokeObjectURL(url);
        };
    })
    .catch(error => {
        console.error('Error accessing the camera:', error);
        alert('Error accessing the camera. Please check your camera and microphone permissions and try again.');
    });

// Event listener for adding content
addContentButton.addEventListener('click', () => {
    const contentContainer = document.getElementById('content-overlay');
    const newContent = document.createElement('p');
    newContent.textContent = contentCounter + ': ' + contentInput.value;
    contentContainer.appendChild(newContent);
    contentCounter++;
    contentInput.value = '';
});

// Event listener for record button
recordButton.addEventListener('click', () => {
    recordedChunks = [];
    mediaRecorder.start();
});

// Event listener for pause button
pauseButton.addEventListener('click', () => {
    mediaRecorder.pause();
});

// Event listener for play button
playButton.addEventListener('click', () => {
    mediaRecorder.resume();
});

// Event listener for stop and download button
stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
});

function handleDataAvailable(event) {
    recordedChunks.push(event.data);
}
