import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';
import * as TELEPORT from 'aframe-teleport-controls';
import * as FPSCOUNTER from 'aframe-fps-counter-component';
import * as EXTRAS from 'aframe-extras';
EXTRAS;

import rightGripListener from './components/controllers/right-grip-listener';
import leftTriggerListener from './components/controllers/left-trigger-listener';
import rightTriggerListener from './components/controllers/right-trigger-listener';
import rightAButtonListener from './components/controllers/right-abutton-listener';
import collisionListener from './components/controllers/collision-listener';
import rotationController from './components/controllers/rotation-controller';
import scaleController from './components/controllers/scale-controller';
import tooltipListener from './components/controllers/tooltip-listener';
import controllerMaterial from './components/controllers/controller-material-controller';
controllerMaterial;

import modelSubset from './components/utils/model_subset';

import globalMenu from './components/ui/globalMenu';
import objAttrList from './components/ui/objAttrList';
import bottleDescription from './components/ui/bottleDescrip';

import dataSource from './components/dataflow/dataSource';
import dataFilter from './components/dataflow/dataFilter';
import dataReceiver from './components/dataflow/dataReceiver';
import vectorSource from './components/dataflow/vectorSource'
vectorSource;
import switchSource from './components/dataflow/switchSource'
switchSource;
import sliderSource from './components/dataflow/sliderSource'
sliderSource;

import plusOperator from './components/dataflow/operators/plus'
plusOperator;
import subtractOperator from './components/dataflow/operators/subtract'
subtractOperator;
import vecToNum from './components/dataflow/operators/vecToNum'
vecToNum;
import numToVec from './components/dataflow/operators/numToVec'
numToVec;
import conditionBool from './components/dataflow/operators/conditionBool'
conditionBool;
import conditionLarger from './components/dataflow/operators/conditionLarger'
conditionLarger;

import drawLine from './components/lines/drawLine';
import lineProperties from './components/lines/lineProperties';

import leftGripListener from './components/controllers/left-grip-listener'
leftGripListener;

import stateBinding from './state-binding/index'
stateBinding;

import vector from './components/utils/vector'
vector;
import swtch from './components/utils/swtch'
swtch;
import slider from './components/utils/slider'
slider;
import entityFollow from './components/utils/entityFollow'
entityFollow;
import operatorModel from './components/utils/operatorModel'
operatorModel;

import spotLight from './components/lights/spotlight'
spotLight;
import glowEffect from './components/utils/glowEffect'
glowEffect;

import headset from './components/avatars/headset'
headset;
import leftController from './components/avatars/leftController'
leftController;
import rightController from './components/avatars/rightController'
rightController;

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
AFRAME.registerComponent('data-source', dataSource);
AFRAME.registerComponent('data-filter', dataFilter);
AFRAME.registerComponent('data-receiver', dataReceiver);
AFRAME.registerComponent('draw-line', drawLine);
AFRAME.registerComponent('line-properties', lineProperties);