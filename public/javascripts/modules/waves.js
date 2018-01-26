const N = 30;
const r = 15;
const A = 1;
const dt = 0.015;
const maxSlope = 0.1;

function initializeWaveArray(N,r,A) {
  let arr = [];
  const phase = Math.PI * Math.random();
  const amplitude = 0.5*A + A*Math.random();
  for (let i = 0; i < N; i++) arr.push({
    x: r*2/N*i-r*(N-1)/N,
    y: amplitude * Math.sin(4*Math.PI/N*i + phase),
    v: 0
  });

  return arr;
}

function updateWaveArray(data) {
  const h = r*2/N;
  const c = h/dt;
  const k = (c*c)/(h*h);
  const s = 0.95;

  return data.map(function (curr, i, u) {
    const prev = (i == 0) ? -curr.y : u[i-1].y;
    const next = (i == u.length-1) ? -curr.y : u[i+1].y;
    const f = k * (prev + next - 2 * curr.y);
    const v = s * ( curr.v + f * dt );

    return {
      x: curr.x,
      y: curr.y + v * dt,
      v: v
    }
  });
}

function waveLine(data) {
  return (d3.line()
      .x(function (d) { return d.x; })
      .y(function (d) { return d.y; })
      .curve(d3.curveBasis))(data);
}

function countWaveEnergy(wave) {
  return wave.reduce(function (acc, curr) {
    return acc + Math.abs(curr.y);
  }, 0);
}

export function initializeWave(parent, gradient) {
  const data = initializeWaveArray(N,r,A);
  const element = parent.append("path")
      .attr("class", "wave")
      .style("fill", "transparent")
      .attr("stroke", "url(#"+gradient.id+")")
      .attr("stroke-width", "0.3")
      .attr("d", waveLine(data));
  return { element: element, data: data };
}

export function applyForceToWave(wave, f) {
  const target = Math.floor(N * Math.random());
  const direction = ((Math.random < 0.5) ? -1 : 1);
  return wave.map(function (d, i) {
    if (i === target) {
      return {
        x: d.x,
        y: d.y - direction * f,
        v: d.v
      };
    } else if (i === target-1 || i === target+1) {
      return {
        x: d.x,
        y: d.y - direction * 0.25 * f,
        v: d.v
      }
    }
    return Object.assign({}, d);
  });
}

export function waveSimulation(parent, waves) {
  parent.selectAll("path.wave")
    .transition()
      .duration(dt * 10000)
      .ease(d3.easeLinear)
      .attr("stroke-width", function (d, i) {
        var energy = countWaveEnergy(waves[i]);
        return 0.1 + 0.2 * energy / 200;
        //return 0.1 + 0.2 * Math.random();
      })
      .attr("d", function (d, i) {
        waves[i] = updateWaveArray(waves[i]);
        return waveLine(waves[i]);
      });

  setTimeout(() => waveSimulation(parent, waves), dt * 10000);
}
