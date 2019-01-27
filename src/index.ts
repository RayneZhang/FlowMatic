import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';

import rightGripListener from './components/controllers/right-grip-listener';
import leftTriggerListener from './components/controllers/left-trigger-listener';
import rightTriggerListener from './components/controllers/right-trigger-listener';
import rightAButtonListener from './components/controllers/right-abutton-listener';
import collisionListener from './components/controllers/collision-listener';

import modelSubset from './components/model-subset/model-subset';
import globalMenu from './components/ui/globalMenu';
import objAttrList from './components/ui/objAttrList';

import bottleDescription from './components/bottles/bottleDescrip';
import dataSource from './components/bottles/dataSource';
import dataFilter from './components/bottles/dataFilter';
import dataReceiver from './components/bottles/dataReceiver';
import drawLine from './components/lines/drawLine';
import lineProperties from './components/lines/lineProperties';
import filterDescription from './components/bottles/filterDescription';

import EntityFollow from './components/Utils/EntityFollow';
import rotationController from './components/controllers/rotation-controller';

console.log(ENVIRONMENT);

declare const THREE:any;

AFRAME.registerComponent('right-grip-listener', rightGripListener);
AFRAME.registerComponent('right-trigger-listener', rightTriggerListener);
AFRAME.registerComponent('left-trigger-listener', leftTriggerListener);
AFRAME.registerComponent('right-abutton-listener', rightAButtonListener);
AFRAME.registerComponent('collision-listener', collisionListener);
AFRAME.registerComponent('rotation-controller', rotationController);


AFRAME.registerComponent('global-menu', globalMenu);
AFRAME.registerComponent('model-subset', modelSubset);
AFRAME.registerComponent('obj-attributes-list', objAttrList);

AFRAME.registerComponent('bottle-description', bottleDescription);
AFRAME.registerComponent('filter-description', filterDescription);
AFRAME.registerComponent('data-source', dataSource);
AFRAME.registerComponent('data-filter', dataFilter);
AFRAME.registerComponent('data-receiver', dataReceiver);
AFRAME.registerComponent('draw-line', drawLine);
AFRAME.registerComponent('line-properties', lineProperties);

AFRAME.registerComponent('entity-follow', EntityFollow);