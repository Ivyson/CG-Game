WebGLUtils = (function() {
 
    function setupWebGL(canvas, opt_attribs) {
 
  
      var context = create3DContext(canvas, opt_attribs);
      if (!context) {
        showLink(OTHER_PROBLEM);
      }
      return context;
    }
  
    function create3DContext(canvas, opt_attribs) {
      var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
      var context = null;
      for (var ii = 0; ii < names.length; ++ii) {
        if (context) {
          break;
        }
        else{
            try {
                context = canvas.getContext(names[ii], opt_attribs);
              } catch(e) {}
        }
      }
      return context;
    }
    return {
      create3DContext: create3DContext,
      setupWebGL: setupWebGL
    };
  })();
  
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) {
             window.setTimeout(callback, 1000/60);
           };
  })();
  