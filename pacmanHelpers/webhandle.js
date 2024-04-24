let vertexSource = '';
let fragmentSource = '';

async function fetchShaders() {
        const responseVs = await fetch('pacmanHelpers/vsShader.shader');
        if (!responseVs.ok) {
            throw new Error('No vs Shader Found');
        }
        vertexSource = await responseVs.text();
        console.log(vertexSource, "Is Vs Shader");

        const responseFs = await fetch('pacmanHelpers/fsShader.shader');
        if (!responseFs.ok) {
            throw new Error('No fs Shader Found');
        }
        fragmentSource = await responseFs.text();
        console.log(fragmentSource, "Is Fragment");

}
try{
  fetchShaders();
}
catch(error)
{
  console.error('Error fetching shaders:', error.message);
}
// console.log('Fragment Shader',fragmentSource, "vsShader:",vertexSource);
