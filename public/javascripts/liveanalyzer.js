import {initializeLinearGradient} from './modules/gradients';
import { initializeWave, waveSimulation, applyForceToWave } from "./modules/waves";
import initializeAudio from './modules/audiorecorder';

const HEIGHT = 15;
const WIDTH = 30;
const OFFSET = - WIDTH / 2;

const waveAudioLine = dataArray => {
  return (d3.line()
    .x((p,i) => WIDTH / dataArray.length * i + OFFSET)
    .y((p,i) => - p / 128.0 * HEIGHT / 2 + HEIGHT / 4)
  )(dataArray);
};
const handleAudioData = wave => dataArray => {
  wave.attr("stroke", "black").attr("stroke-width", "0.1").attr("d", waveAudioLine(dataArray));
};

export default function liveanalyzer() {

  // Find the SVG to draw on
  const svg = d3.select("svg");
  const defs = svg.append("defs");

  // Add a line
  const gradient = initializeLinearGradient(defs, "White", "#77afb6");
  let wave = initializeWave(svg, gradient).element;

  // Attach to audio

  const broadcaster = initializeAudio();
  broadcaster.subscribe("listen", handleAudioData(wave));

}
