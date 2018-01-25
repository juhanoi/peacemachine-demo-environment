import { initializeLinearGradient } from "./modules/gradients";
import { initializeWave, waveSimulation, applyForceToWave } from "./modules/waves";

export default function visualization() {

  // Find the SVG to draw on
  const svg = d3.select("svg");
  const defs = svg.append("defs");

  const gradientRed = initializeLinearGradient(defs, "Red", "#A00");
  const gradientBlue = initializeLinearGradient(defs, "Blue", "#00A");
  const gradientGreen = initializeLinearGradient(defs, "Green", "#0A0");
  const gradientPurple = initializeLinearGradient(defs, "Purple", "#70A");


  // Create the center circle
  const circle = svg.append("circle")
      .style("fill", "#222")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 15);


  // Wave simulation
  const waves = [
    initializeWave(svg, gradientRed),
    initializeWave(svg, gradientBlue),
    initializeWave(svg, gradientGreen),
    initializeWave(svg, gradientPurple)
  ];
  waveSimulation(svg, waves);


  // Text
  function wordPosition(i) {
    const alpha = 5.8 * i;  // deg // 62 lines can fit one circle
    const beta = Math.PI / 180 * alpha; // rad
    const x = 16 * Math.cos(beta);
    const y = 16 * Math.sin(beta);
    return { alpha: alpha, beta: beta, x: x, y: y };
  }

  function showSentences(sentences, callback) {
    svg.selectAll("text")
        .data(sentences).enter()
        .append("text")
            .style("font-size", "0.8px")
            .style("font-weight", function (d,i) { return (!!d.anger || !!d.fear || !!d.joy || !!d.sadness) ? "normal" : "bold"; })
            .style("fill", function (d,i) {
              if (d.anger > 0) return "#A00";
              if (d.fear > 0) return "#00A";
              if (d.joy > 0) return "#0A0";
              if (d.sadness > 0) return "#70A";
              return "#000";
            })
            .attr("fill-opacity", "0")
            .attr("text-anchor", "start")
            .attr("transform", function (d,i) {
              const p = wordPosition(i);
              return "translate(" + [ p.x, p.y ] + ")rotate(" + p.alpha + ")";
            })
            .text(function (d) { return d.text; })
            .transition()
                .delay(function(d,i) { return 200*i; })
                .duration(152)
                .attr("fill-opacity", 1)
                .on("end", function(d,i) {
                  if (d.anger > 0) waves[0] = applyForceToWave(waves[0], d.anger*10);
                  if (d.fear > 0) waves[1] = applyForceToWave(waves[1], d.fear*10);
                  if (d.joy > 0) waves[2] = applyForceToWave(waves[2], d.joy*10);
                  if (d.sadness > 0) waves[3] = applyForceToWave(waves[3], d.sadness*10);
                })
            .transition()
                .delay(1000)
                .duration(1000)
                .attr("fill-opacity", 0)
                .on("end", function(d,i) {
                  if (svg.selectAll("text").size() === 1) {
                    callback.call();
                  }
                })
            .remove();
  };

  (function readFiles(index) {
    const files = [
      "/data/lorem.json",
      "/data/lorem2.json"
    ];

    d3.json(files[index], function (data) {
      showSentences(data, function() {
        if (index === files.length-1) {
          setTimeout(() => readFiles(0), 1000);
        } else {
          setTimeout(() => readFiles(index+1), 1000);
        }
      });
    });
  })(0);


}
