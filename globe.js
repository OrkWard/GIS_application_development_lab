// allocate token and initialize viewer
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmZmODFjMS0yMTA5LTQ4ZGQtODY1MS0wZDMzNGUxODk5NWEiLCJpZCI6ODY0NDYsImlhdCI6MTY0NzgzMzEzNn0.Z6RZYH594BXEBh2a5LwKCF7fw5NhlSCRxnibcOz9O8k";
const viewer = new Cesium.Viewer("cesium-container", {
	timeline: false,
	navigationHelpButton: false,
	fullscreenButton: false,
	homeButton: false,
	dataSourceDisplay: false,
	animation: false,
});
let terrainProvider = new Cesium.CesiumTerrainProvider({
	url: Cesium.IonResource.fromAssetId(1),
	requestWaterMask: true,
	requestVertexNormals: true,
});
viewer.terrainProvider = terrainProvider;

viewer.camera.flyTo({
  destination : Cesium.Cartesian3.fromDegrees(121, 31, 400),
  orientation : {
    heading : Cesium.Math.toRadians(0.0),
    pitch : Cesium.Math.toRadians(-15.0),
  }
});

$(".cesium-widget-credits").style.display = "none";