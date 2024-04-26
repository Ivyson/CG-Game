let PerspectiveCam = (angle, near, far, aspectRatio) => {
    let FOV = 1/(Math.tan(angle));
    let distance = far - near;
    return new Float32Array([
        FOV*(1/aspectRatio), 0, 0, 0,
        0, FOV, 0, 0,
        0, 0, -(near+far)/distance, -2*(near*far)/d,
        0, 0, -1, 0
    ]);
};

function translate(tx, ty, tz){
    return new Float32Array([
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    ]);
}

funct