import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';

import gripListener from './grip-listener';
import triggerListener from './trigger-listener';
import intersectedListener from './intersected-listener';
import intersectionListener from './intersection-listener';
import uiComponent from './components/ui/uiComponent';
import modelSubset from './components/model-subset/model-subset';

console.log(ENVIRONMENT);

declare const THREE:any;

AFRAME.registerComponent('grip-listener', gripListener);
AFRAME.registerComponent('trigger-listener', triggerListener);
AFRAME.registerComponent('intersected-listener', intersectedListener);
AFRAME.registerComponent('intersection-listener', intersectionListener);
AFRAME.registerComponent('model-subset', modelSubset);
AFRAME.registerComponent('ui', uiComponent);