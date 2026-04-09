import mitt from 'mitt';
const VueEmit = mitt();


const EVENT_BUS = {
  $emit: VueEmit.emit,
  $on: VueEmit.on,
  $off:VueEmit.off
}
const EVENT_NAME = {
  addMarker: 'addMarker',
  updateMarker: 'updateMarker',
  removeMark: 'removeMark',
  gotoMarker: 'gotoMarker',
  toCenter: 'toCenter',

/*  changeCurrViewer: 'changeCurrViewer',
  setMarkers: 'setMarkers',
  renderMarkers: 'renderMarkers',
  updateMarkerInfo: 'updateMarkerInfo',
  gotoMarker: 'gotoMarker',
  gotoPosition: 'gotoPosition',
  changeMarkImage: 'changeMarkImage',

  saveWangEditor: 'saveWangEditor'*/

}
export {
  EVENT_BUS,
  EVENT_NAME
}