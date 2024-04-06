// import {webgl,fShader, Buffer, compileShader, createProgram,} from "./main.js";
// console.log(webgl);
// function drawCircle() {
  let theta = 2 * Math.PI;
  let segments = 60;
  let x, y;
  let cvertices = [];
  for (let i = 0; i < segments; i += theta / segments) {
    x = 0.1 * Math.cos(i);
    y = 0.1 * Math.sin(i);
    // console.log(cvertices);
    cvertices.push(x, y);
  }
//   let circlebuffer = Buffer(new Float32Array(cvertices));
//   console.log(circlebuffer);
//   fetch("circlevertex.glsl")
//     .then((response) => {
//       console.log(response.status);
//       if (response.ok) {
//         return response.text();
//       } else {
//         return null;
//       }
//     })
//     .then((cvShader) => {
//       let myShader = compileShader(webgl, cvShader, webgl.VERTEX_SHADER);
//       console.log(myShader);
//       let cProgram = createProgram(webgl, myShader, fShader);
//       console.log(cProgram);
//       let cPosition = webgl.getAttribLocation(cProgram, "pos");
//       console.log(cPosition,"yes");
//       webgl.enableVertexAttribArray(cPosition);
//       webgl.vertexAttribPointer(cPosition, 2, webgl.FLOAT, false, 0, 0);
//       webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 120);
//     });
// }
// drawCircle();