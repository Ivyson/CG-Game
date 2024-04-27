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
    return new Float32Array(multiplyMatrices(matrix, [
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
//return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
 function rotateX(matrix, angle) {
const sinAngle = Math.sin(angle);
const cosAngle = Math.cos(angle);
 return new Float32Array(multiplyMatrices(matrix, [
1, 0, 0, 0,
0, cosAngle, -sinAngle, 0,
0, sinAngle, cosAngle, 0,
0, 0, 0, 1,
0, 0, 0, 1
]));
}
 function rotateY(matrix, angle) {
const sinAngle = Math.sin(angle);
const cosAngle = Math.cos(angle);
 return new Float32Array(multiplyMatrices(matrix, [
cosAngle, 0, sinAngle, 0,
0, 1, 0, 0,
-sinAngle, 0, cosAngle, 0,
0, 0, 0, 1,
0, 0, 0, 1
]));
}
 function rotateZ(matrix, angle) {
const sinAngle = Math.sin(angle);
const cosAngle = Math.cos(angle);
 return new Float32Array(multiplyMatrices(matrix, [
cosAngle, sinAngle, 0, 0,
-sinAngle, cosAngle, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1
]));
}
function multiplyMatrices(m1, m2) {
    const rows_m1 = m1.length;
    const cols_m1 = m1[0].length;
    const cols_m2 = m2[0].length;

    // Initialize the result matrix with zeros
    const result = Array.from({ length: rows_m1 }, () => Array(cols_m2).fill(0));

    for (let i = 0; i < rows_m1; i++) {
        for (let j = 0; j < cols_m2; j++) {
            let sum = 0;
            for (let k = 0; k < cols_m1; k++) {
                sum = sum + m1[i][j] * m2[j][k];
            }
            result[i][j] = sum;
        }        
    }

    return result;
}
function scale(matrix,sx, sy, sz)
{
    return new Float32Array(multiplyMatrices(matrix, [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
        ]));
}