let vertexSource = '';
let fragmentSource = '';
fetch('pacmanHelpers/vsShader.shader')
.then(response => {
  console.log(response.status);
  if(response.ok)
  {
    return response.text();
  }
  else{
    throw new Error('No vs Shader Found')
  }
})
.then(vShader => {
  vertexSource = vShader;
  console.log(vertexSource, "Is Vs Shader")
})
fetch('pacmanHelpers/fsShader.shader')
.then(response => {
  console.log(response.status);
  if(response.ok)
  {
    return response.text();
  }
  else{
    throw new Error('No vs Shader Found')
  }
})
.then(fShader => {
  fragmentSource = fShader;
  console.log(fragmentSource, "Is Fragment");
})
