
class AudioBroadcaster {
  constructor(ctx) {
    this.FFTSIZE = 2048;
    this.ctx = ctx;
    this.analyzer = null;
    this.subscribers = {};
  }

  attachStream(stream) {
    const source = this.ctx.createMediaStreamSource(stream);
    this.analyzer = this.ctx.createAnalyser();
    this.analyzer.fftsize = this.FFTSIZE;

    source.connect(this.analyzer);
    this.analyzer.connect(this.ctx.destination);

    this.readAndBroadcast();
  }

  subscribe(key, callback) {
    this.subscribers[key] = callback;
  }

  readAndBroadcast() {
    requestAnimationFrame(() => this.readAndBroadcast());
    let dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteTimeDomainData(dataArray);
    Object.keys(this.subscribers).forEach((key) => this.subscribers[key].call(null, dataArray));
  }
}

const handleAudioError = error => {
  console.log(error);
};

export default function initializeAudio() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  const ctx = new AudioContext();
  const audioBroadcaster = new AudioBroadcaster(ctx);
  navigator.getUserMedia({ audio: true }, (stream) => audioBroadcaster.attachStream(stream), handleAudioError);

  return audioBroadcaster;
};
