import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';

import uiComponent from './components/ui/uiComponent';
import modelSubset from './components/model-subset/model-subset';
import rightGripListener from './components/controllers/right-grip-listener';
import leftTriggerListener from './components/controllers/left-trigger-listener';
import rightTriggerListener from './components/controllers/right-trigger-listener';

console.log(ENVIRONMENT);

declare const THREE:any;

AFRAME.registerComponent('right-grip-listener', rightGripListener);
AFRAME.registerComponent('right-trigger-listener', rightTriggerListener);
AFRAME.registerComponent('left-trigger-listener', leftTriggerListener);
AFRAME.registerComponent('model-subset', modelSubset);
AFRAME.registerComponent('ui', uiComponent);