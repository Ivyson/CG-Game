let PerspectiveCam = (angle, aspectRatio, near, far) => {
    angletorad = angle*(Math.PI/180); //Converting the angle in degrees  to radians  
    let FOV = 1/(Math.tan(angletorad/2));
    let distance = far - near;
    return new Float32Array([
        FOV*(1/aspectRatio), 0, 0, 0,
        0, FOV, 0, 0,
        0, 0, -(near+far)/distance, -2*(near*far)/distance,
        0, 0, -1, 0
    ]);
};

function translateMat(matrix, tx, ty, tz){
    return new Float32Array(matmultiply(matrix, [
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
        ]));
}
function createIdentityMatrix() {
return [
1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1
];
}
function rotateX(matrix, angle) {
    angle = toRadians(angle);
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
     return (matmultiply(matrix, [
    1, 0, 0, 0,
    0, cosAngle, -sinAngle, 0,
    0, sinAngle, cosAngle, 0,
    0, 0, 0, 1,
    0, 0, 0, 1
    ]));
    }
function rotateY(matrix, angle) {
    angle = toRadians(angle);
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
     return new Float32Array(matmultiply(matrix, [
    cosAngle, 0, sinAngle, 0,
    0, 1, 0, 0,
    -sinAngle, 0, cosAngle, 0,
    0, 0, 0, 1,
    0, 0, 0, 1
    ]));
    }
function rotateZ(matrix, angle) {
    angle = toRadians(angle);
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
     return new Float32Array(matmultiply(matrix, [
    cosAngle, sinAngle, 0, 0,
    -sinAngle, cosAngle, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
    ]));
    }
function matmultiply(mat1, mat2) {
    let result = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += mat1[i * 4 + k] * mat2[k * 4 + j];
          // console.log(sum);
        }
        result.push(sum);
      }
    }
    console.log(result);
    return new Float32Array(result);
  }
function scale(matrix,sx, sy, sz)
{
    return new Float32Array(matmultiply(matrix, [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
        ]));
}
function toRadians(theta)
{
    return theta*(Math.PI/180);
}