
var numVertex = 4;
var numSides = 6;
var vertices = [];
var indices = [];
var angleX = 0;
var angleY = 0;

var radius = 1.0;
var stacks = 30;
var slices = 30;
var normals = [];



function createFlatShadedSphere(){
    var phi1 = i * Math.PI / stacks;
    var phi2 = (i + 1) * Math.PI / stacks;

    for(var j=0; j<=slices; j++){
        var theta1 = j * 2 * Math.PI / slices;
        var theta2 = (j + 1) * 2 * Math.PI / slices;

        var p1 = sphericalToCartesian(radius, phi1, theta1);
        var p2 = sphericalToCartesian(radius, phi1, theta2);
        var p3 = sphericalToCartesian(radius, phi2, theta1);
        var p4 = sphericalToCartesian(radius, phi2, theta2);

        var normal = calculateNormal(p1, p2, p3);

        addTriangle(p1, p2, p3, normal);
        addTriangle(p2, p4, p3, normal);
    }
}


function calculateNormal(p1, p2, p3){
    var u = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    var v = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];

    // compute u x v

    var nx = u[1] * v[2] - u[2] * v[1]; // x comp of normal at p1
    var ny = u[2] * v[0] - u[0] * v[2]; // y comp of normal at p1
    var nz = u[0] * v[1] - u[1] * v[0]; // z comp of normal at p1

    var len = Math.sqrt(nx * nx + ny * ny + nz * nz);

    return [nx / len, ny / len, nz / len];
}


function addTriangle(p1, p2, p3, normal){
    vertices.push(...p1,...p2,...p3);
    normals.push(...normal, ...normal, ...normal);
    indices.push(indices.length, indices.length + 1, indices.length + 2);
}

function sphereToCatesian(r, phi, theta){
    var sinPhi = Math.sin(phi);
    var cosPhi = Math.cos(phi);

    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    var x = r * sinPhi * cosTheta;
    var y = r * sinPhi * sinTheta;
    var z = r * cosPhi;

    return [x, y, z];
}


function createTransformationMatrix(){

    var cosX = Math.cos(angleX);
    var sinX = Math.sin(angleX);
    var cosY = Math.cos(angleY);
    var sinY = Math.sin(angleY);

    return new Float32Array([
        cosY, 0, sinY, 0,
        sinX * sinY, cosX, -cosY * sinX, 0,
        -sinY * cosX, sinX, cosX * cosY, 0,
        0, 0, 0, 1
    ]);

}

function createNormalMatrix(modalMatrix) {
    return new Float32Array([
        modalMatrix[0], modalMatrix[1], modalMatrix[2],
        modalMatrix[4], modalMatrix[5], modalMatrix[6],
        modalMatrix[8], modalMatrix[9], modalMatrix[10]
    ]);
}

function main(){
    

}



  



