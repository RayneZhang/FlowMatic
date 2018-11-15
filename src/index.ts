import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';

import rightGripListener from './components/controllers/right-grip-listener';
import leftTriggerListener from './components/controllers/left-trigger-listener';
import rightTriggerListener from './components/controllers/right-trigger-listener';

import modelSubset from './components/model-subset/model-subset';
import globalMenu from './components/ui/globalMenu';
import objAttrList from './components/ui/objAttrList';
import bottleDescription from './components/bottles/bottledescrip';

console.log(ENVIRONMENT);

declare const THREE:any;

AFRAME.registerComponent('right-grip-listener', rightGripListener);
AFRAME.registerComponent('right-trigger-listener', rightTriggerListener);
AFRAME.registerComponent('left-trigger-listener', leftTriggerListener);

AFRAME.registerComponent('global-menu', globalMenu);
AFRAME.registerComponent('model-subset', modelSubset);
AFRAME.registerComponent('obj-attributes-list', objAttrList);

AFRAME.registerComponent('bottle-description', bottleDescription);