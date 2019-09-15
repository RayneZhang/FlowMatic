import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';
ENVIRONMENT;
import * as TELEPORT from 'aframe-teleport-controls';
TELEPORT;
import * as FPSCOUNTER from 'aframe-fps-counter-component';
FPSCOUNTER;
import * as PHYSICS from 'aframe-physics-system';
PHYSICS;
import * as EXTRAS from 'aframe-extras';
EXTRAS;
import * as PHYSICSEx from 'aframe-physics-extras';
PHYSICSEx;
import * as cubemap from 'aframe-cubemap-component';
cubemap;

import rightTriggerListener from './components/controllers/right-trigger-listener';
import collisionListener from './components/controllers/collision-listener';
import rotationController from './components/controllers/rotation-controller';
import scaleController from './components/controllers/scale-controller';

import { rightAButtonListener } from './components/controllers/right-abutton-listener';
rightAButtonListener;
import { rightBButtonListener } from './components/controllers/right-bbutton-listener';
rightBButtonListener;
import { rightGripListener } from './components/controllers/right-grip-listener';
rightGripListener;

import controllerMaterial from './components/controllers/controller-material-controller';
controllerMaterial;
import entityFollow from './components/utils/entityFollow';
entityFollow;

import modelSubset from './components/utils/model_subset';
modelSubset;
import globalMenu from './components/ui/globalMenu';
globalMenu;
import objAttrList from './components/ui/objAttrList';
objAttrList;
import bottleDescription from './components/ui/bottleDescrip';
bottleDescription;

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

import lineComponent from './components/lines/LineComponent';
lineComponent;
import { storedEdges } from './components/lines/StoredEdges';
storedEdges;

import stateBinding from './state-binding/index'
stateBinding;

import vector from './components/utils/vector'
vector;
import swtch from './components/utils/swtch'
swtch;
import slider from './components/utils/slider'
slider;
import operatorModel from './components/utils/operatorModel'
operatorModel;
import spotLight from './components/lights/spotlight'
spotLight;
import { objInit } from './components/Utils/ObjInit';
objInit;

import headset from './components/avatars/headset'
headset;
import leftController from './components/avatars/leftController'
leftController;
import rightController from './components/avatars/rightController'
rightController;
AFRAME.registerComponent('right-trigger-listener', rightTriggerListener);
AFRAME.registerComponent('collision-listener', collisionListener);
AFRAME.registerComponent('rotation-controller', rotationController);
AFRAME.registerComponent('scale-controller', scaleController);
AFRAME.registerComponent('data-source', dataSource);
AFRAME.registerComponent('data-filter', dataFilter);
AFRAME.registerComponent('data-receiver', dataReceiver);

import collisionDetector from './components/frp/operators/collisionDetector';
collisionDetector;
import conditionalEvent from './components/frp/operators/conditionalEvent';
conditionalEvent;
import eventReceiver from './components/frp/eventReceiver';
eventReceiver;

import mtlLighting from './components/Utils/mtlLighting';
mtlLighting;
import { canvasGenerator } from './components/ui/Canvas';
canvasGenerator;
import { objNodeUpdate } from './components/frp/ObjNodeUpdate';
objNodeUpdate;
import { avatarNodeUpdate } from './components/frp/AvatarNodeUpdate';
avatarNodeUpdate;
import { opNodeUpdate } from './components/frp/OpNodeUpdate';
opNodeUpdate;

// const a = scene.addConstant(2000);
// const gen = scene.addOp('gen');
// scene.addEdge(a, {node: gen, prop: 'delay'})
// const b = scene.addConstant(10);
// const p = scene.addOp('+');
// scene.addEdge(b, p);
// scene.addEdge(gen, p);
// const t = scene.addOp('take');
// const three = scene.addConstant(5);
// scene.addEdge(p, {node: t, prop: 'stream'});
// scene.addEdge(three, {node: t, prop: 'count'});
// const delay = scene.addOp('delay');
// scene.addEdge(t, {node: delay, prop: 'stream'});
// const d2 = scene.addConstant(700);
// scene.addEdge(d2, {node: delay, prop: 'delay'});

// p.pluckOutput().subscribe(function (value) {
//     console.log("add output is", value);
// });