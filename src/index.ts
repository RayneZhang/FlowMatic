import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';
import * as TELEPORT from 'aframe-teleport-controls';
import * as FPSCOUNTER from 'aframe-fps-counter-component';

import rightGripListener from './components/controllers/right-grip-listener';
import leftTriggerListener from './components/controllers/left-trigger-listener';
import rightTriggerListener from './components/controllers/right-trigger-listener';
import rightAButtonListener from './components/controllers/right-abutton-listener';
import collisionListener from './components/controllers/collision-listener';
import rotationController from './components/controllers/rotation-controller';
import scaleController from './components/controllers/scale-controller';
import tooltipListener from './components/controllers/tooltip-listener';

import modelSubset from './components/utils/model_subset';
import EntityFollow from './components/utils/EntityFollow';

import globalMenu from './components/ui/globalMenu';
import objAttrList from './components/ui/objAttrList';
import bottleDescription from './components/ui/bottleDescrip';

import dataSource from './components/dataflow/dataSource';
import dataFilter from './components/dataflow/dataFilter';
import dataReceiver from './components/dataflow/dataReceiver';
import vectorSource from './components/dataflow/vectorSource'
vectorSource;

import drawLine from './components/lines/drawLine';
import lineProperties from './components/lines/lineProperties';

import leftGripListener from './components/controllers/left-grip-listener'
leftGripListener;

import stateBinding from './state-binding/index'
stateBinding;

import vector from './components/utils/vector'
vector;

import plusOperator from './components/operators/plus'
plusOperator;
import subtractOperator from './components/operators/subtract'
subtractOperator;
import filterDescription from './components/operators/filterDescription';

import spotLight from './components/lights/spotlight'
spotLight;

import headset from './components/avatars/headset'
headset;

import meshLine from './components/lines/meshLine'
meshLine;

import gridGlitchShader from './shaders/test'
gridGlitchShader;

ENVIRONMENT;
TELEPORT;
FPSCOUNTER;

AFRAME.registerComponent('right-grip-listener', rightGripListener);
AFRAME.registerComponent('right-trigger-listener', rightTriggerListener);
AFRAME.registerComponent('left-trigger-listener', leftTriggerListener);
AFRAME.registerComponent('right-abutton-listener', rightAButtonListener);
AFRAME.registerComponent('collision-listener', collisionListener);
AFRAME.registerComponent('rotation-controller', rotationController);
AFRAME.registerComponent('scale-controller', scaleController);
AFRAME.registerComponent('tooltip-listener', tooltipListener);

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