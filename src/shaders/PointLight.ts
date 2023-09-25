import * as AFRAME from 'aframe'

const vShader = `
layout (std140) uniform Matrices {
    mat4 m_pvm;
    mat4 m_viewModel;
    mat3 m_normal;
};
 
layout (std140) uniform Lights {
    vec4 l_pos;
};
 
in vec4 position;
in vec3 normal;
 
out Data {
    vec3 normal;
    vec3 eye;
    vec3 lightDir;
} DataOut;
 
void main () {
 
    vec4 pos = m_viewModel * position;
 
    DataOut.normal = normalize(m_normal * normal);
    DataOut.lightDir = vec3(l_pos - pos);
    DataOut.eye = vec3(-pos);
 
    gl_Position = m_pvm * position; 
}
`;

const fShader = `
out vec4 colorOut;
 
layout (std140) uniform Materials {
    vec4 diffuse;
    vec4 ambient;
    vec4 specular;
    float shininess;
};
 
in Data {
    vec3 normal;
    vec3 eye;
    vec3 lightDir;
} DataIn;
 
void main() {
 
    vec4 spec = vec4(0.0);
 
    vec3 n = normalize(DataIn.normal);
    vec3 l = normalize(DataIn.lightDir);
    vec3 e = normalize(DataIn.eye);
 
    float intensity = max(dot(n,l), 0.0);
    if (intensity > 0.0) {
        vec3 h = normalize(l + e);
        float intSpec = max(dot(h,n), 0.0);
        spec = specular * pow(intSpec, shininess);
    }
 
    colorOut = max(intensity * diffuse + spec, ambient);
}
`;

const pointLightShader = AFRAME.registerShader('point-light', {
    schema: {
      color: {type: 'color', is: 'uniform'},
      timeMsec: {type: 'time', is: 'uniform'}
    },
  
    vertexShader: vShader,
    fragmentShader: fShader
});

export default pointLightShader;