import {initializeLinearGradient} from './modules/gradients';
import { initializeWave, waveSimulation, applyForceToWave } from "./modules/waves";

export default function liveanalyzer() {

  // Find the SVG to draw on
  const svg = d3.select("svg");
  const defs = svg.append("defs");

  // Add a line
  const gradient = initializeLinearGradient(defs, "White", "#000");
  let waves = [ initializeWave(svg, gradient) ];

  waveSimulation(svg, waves);

  setInterval(() => waves[0] = applyForceToWave(waves[0], 5), 1500);

}
