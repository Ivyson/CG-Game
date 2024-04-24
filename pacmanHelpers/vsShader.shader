    precision highp float;
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    varying vec2 vTextureCoord;
    varying vec4 fColor;

    // For the Phong Illumination Model
    attribute vec3 vNormal;
    uniform vec4 viewerPosition;

    // Array of lights
    #define MAX_LIGHTS 5
    uniform int numLights;
    uniform struct Light {

        vec4 position;
        mat4 lightSourceMatrix;
        vec3 intensities;
        vec3 ambientIntensities;

    } allLights[MAX_LIGHTS];

    // The material properties
    uniform vec3 k_ambient;
    uniform vec3 k_diffuse;
    uniform vec3 k_specular;
    uniform float shininess;

    // Spotlight properties
    uniform int difficulty;
    uniform float threshold;


    void main(void) {

        // To allow seeing the points drawn

        // Converting the (x,y,z) vertices to Homogeneous Coord.

        // And multiplying by the Projection and the Model-View matrix

        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

        // Phong Illumination Model

        // Pos is vertex position after applying the global transformation

        vec3 pos = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;

        fColor = vec4(0.0, 0.0, 0.0, 0.0);

        for( int i = 0; i < MAX_LIGHTS; i++ )
        {
            if( i == numLights )

                break;

            // Ambient component is constant for each light source

            vec4 ambient = vec4(0.0, 0.0, 1.0, 1.0 );

            fColor += ambient;

            // Vector from vertex position to light source

            vec3 L, X;

            // Check for directional light

            if(allLights[i].position.w == 0.0)

                L = normalize( (allLights[i].lightSourceMatrix * allLights[i].position).xyz );

            else {
                X = (allLights[i].lightSourceMatrix * allLights[i].position).xyz - pos;
                L = normalize( (allLights[i].lightSourceMatrix * allLights[i].position).xyz - pos );
            }

            // Draw spotlight in hard difficulty (threshold = 3.0)

            if (difficulty == 1 && sqrt(X[0] * X[0] + X[1] * X[1] + X[2] * X[2]) > threshold)
                continue;

            // Vector from the vertex position to the eye

            vec3 E;

            // The viewer is at the origin or at an indefinite distance
            // On the ZZ axis

           if(viewerPosition.w == 1.0)

               // At the origin

                E = -normalize( pos );

           else

               // On the ZZ axis

                E = vec3(0,0,1);

            // Halfway vector

            vec3 H = normalize( L + E );

            // Transform vertex normal into eye coordinates

            vec4 N = normalize( uMVMatrix * vec4(vNormal, 0.0));

            // Compute terms in the illumination equation

            // Diffuse component

            float dotProductLN = L[0] * N[0] + L[1] * N[1] + L[2] * N[2];

            float cosNL = max( dotProductLN, 0.0 );

            vec4  diffuse = vec4( k_diffuse * cosNL * allLights[i].intensities, 1.0 );

            // Specular component

            float dotProductNH = N[0] * H[0] + N[1] * H[1] + N[2] * H[2];

            float cosNH = pow( max( dotProductNH, 0.0 ), shininess );

            vec4  specular = vec4( k_specular * cosNH * allLights[i].intensities, 1.0 );

            if( dotProductLN < 0.0 ) {

              specular = vec4(0.0, 0.0, 0.0, 1.0);
            }

            // Adding the components

            fColor += diffuse + specular;
        }

        // Converting the RGB color value to RGBA

        vTextureCoord = aTextureCoord;

    }

