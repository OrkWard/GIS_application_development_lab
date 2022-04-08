// allocate token and initialize viewer
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmZmODFjMS0yMTA5LTQ4ZGQtODY1MS0wZDMzNGUxODk5NWEiLCJpZCI6ODY0NDYsImlhdCI6MTY0NzgzMzEzNn0.Z6RZYH594BXEBh2a5LwKCF7fw5NhlSCRxnibcOz9O8k";

// 创建viewer
const viewer = new Cesium.Viewer("cesium-container", {
	baseLayerPicker: false,
	timeline: false,
	navigationHelpButton: false,
	fullscreenButton: false,
	homeButton: false,
	dataSourceDisplay: false,
	animation: false,
});
$(".cesium-widget-credits").style.display = "none";
viewer.imageryLayers.remove(viewer.imageryLayers.get(0), true);

// 添加地形
// let terrainProvider = new Cesium.CesiumTerrainProvider({
// 	url: Cesium.IonResource.fromAssetId(1),
// 	requestWaterMask: true,
// 	requestVertexNormals: true,
// });
// viewer.terrainProvider = terrainProvider;

const assets = [
	{
		"id": 96188,
		"type": "3DTILES",
		"name": "Cesium OSM Buildings",
		"description": "A 3D buildings layer derived from OpenStreetMap covering the entire world. It contains over 350 million buildings with per-feature data like name, address, whether a building is commercial or residential, and more.\n\nSee the [Cesium OSM Buildings page](https://cesium.com/content/cesium-osm-buildings/) to learn about the available properties and what you can do with this asset.\n\nThis tileset is updated monthly. For the latest news, visit our [community forum thread](https://community.cesium.com/t/weve-just-updated-cesium-osm-buildings/10764/last).",
		"bytes": 0,
		"attribution": "© [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors",
		"dateAdded": "2020-04-30T22:55:24.481Z",
		"status": "COMPLETE",
		"percentComplete": 100,
		"userId": 86446,
		"labels": [],
		"isPremium": true,
		"isExternal": false,
		"error": null,
		"progressMessage": ""
	},
	{
		"id": 3957,
		"type": "TERRAIN",
		"name": "PAMap Terrain",
		"description": "High resolution terrain of Pennsylvania curated by [Pennsylvania Spatial Data Access (PASDA)](http://www.pasda.psu.edu/)",
		"bytes": 0,
		"attribution": "",
		"dateAdded": "2018-02-26T15:45:11.997Z",
		"status": "COMPLETE",
		"percentComplete": 100,
		"userId": 86446,
		"labels": [],
		"isPremium": true,
		"isExternal": false,
		"error": null,
		"progressMessage": null
	},
	{
		"id": 3956,
		"type": "TERRAIN",
		"name": "ArcticDEM Release 4",
		"description": "ArcticDEM is an NGA-NSF public-private initiative to automatically produce a high-resolution, high quality, digital surface model (DSM) of the Arctic using optical stereo imagery, high-performance computing, and open source photogrammetry software.  Read more about it on their [home page](https://www.pgc.umn.edu/data/arcticdem/)",
		"bytes": 0,
		"attribution": "",
		"dateAdded": "2018-02-25T13:45:00.610Z",
		"status": "COMPLETE",
		"percentComplete": 100,
		"userId": 86446,
		"labels": [],
		"isPremium": true,
		"isExternal": false,
		"error": null,
		"progressMessage": null
	},
	{
		"id": 3845,
		"type": "IMAGERY",
		"name": "Blue Marble Next Generation July, 2004",
		"description": "500m resolution imagery of the Earth in July 2004.\n\nhttps://visibleearth.nasa.gov/view.php?id=74092",
		"bytes": 0,
		"attribution": "NASA Earth Observatory",
		"dateAdded": "2018-02-13T15:14:23.512Z",
		"status": "COMPLETE",
		"percentComplete": 100,
		"userId": 86446,
		"labels": [],
		"isPremium": true,
		"isExternal": false,
		"error": null,
		"progressMessage": null
	},
	{
		"id": 4,
		"type": "IMAGERY",
		"name": "Bing Maps Road",
		"description": "Bing Maps Road",
		"bytes": 0,
		"attribution": "",
		"dateAdded": "2016-10-27T13:33:12.932Z",
		"status": "COMPLETE",
		"percentComplete": 100,
		"userId": 86446,
		"labels": [],
		"isPremium": true,
		"isExternal": true,
		"error": null,
		"progressMessage": null
	},
	{
		"id": 3,
		"type": "IMAGERY",
		"name": "Bing Maps Aerial with Labels",
		"description": "Bing Maps Aerial with Labels",
		"bytes": 0,
		"attribution": "",
		"dateAdded": "2016-10-27T13:32:55.189Z",
		"status": "COMPLETE",
		"percentComplete": 100,
		"userId": 86446,
		"labels": [],
		"isPremium": true,
		"isExternal": true,
		"error": null,
		"progressMessage": null
	},
	{
		"id": 2,
		"type": "IMAGERY",
		"name": "Bing Maps Aerial",
		"description": "Bing Maps Aerial",
		"bytes": 0,
		"attribution": "",
		"dateAdded": "2016-10-27T13:24:08.321Z",
		"status": "COMPLETE",
		"percentComplete": 100,
		"userId": 86446,
		"labels": [],
		"isPremium": true,
		"isExternal": true,
		"error": null,
		"progressMessage": null
	},
	{
		"id": 1,
		"type": "TERRAIN",
		"name": "Cesium World Terrain",
		"description": "High-resolution global terrain tileset curated from several data sources.  See the official [Cesium World Terrain](https://cesium.com/content/cesium-world-terrain/) page for details.",
		"bytes": 0,
		"attribution": "Data available from the U.S. Geological Survey, © CGIAR-CSI, Produced using Copernicus data and information funded by the European Union - EU-DEM layers, Data available from Land Information New Zealand, Data available from data.gov.uk, Data courtesy Geoscience Australia",
		"dateAdded": "2016-10-17T22:04:30.353Z",
		"status": "COMPLETE",
		"percentComplete": 100,
		"userId": 86446,
		"labels": [],
		"isPremium": true,
		"isExternal": false,
		"error": null,
		"progressMessage": null
	}
]

// 生成列表
assets.forEach((element) => {
	if (element.type === "IMAGERY") {
		const image = document.createElement("div");
		image.textContent = element.name;
		image.classList.add("search-result");
		image.dataset.id = element.id;
		image.dataset.type = element.type;
		image.dataset.name = element.name;
		image.addEventListener("click", (e) => {
			const selected = $(".selected-result-image");
			$(".search-box-image").style.display = "none";
			$(".search-result-image").style.display = "none";
			selected.innerHTML = image.innerHTML;
			selected.style.display = "";
			selected.dataset.id = e.target.dataset.id;
			selected.dataset.name = e.target.dataset.name;
		})
		$(".search-result-image").appendChild(image);
	}
})
assets.forEach((element) => {
	if (element.type === "TERRAIN") {
		const terrain = document.createElement("div");
		terrain.textContent = element.name;
		terrain.classList.add("search-result");
		terrain.dataset.id = element.id;
		terrain.dataset.type = element.type;
		terrain.addEventListener("click", (e) => {
			const selected = $(".selected-result-terrain");
			$(".search-box-terrain").style.display = "none";
			$(".search-result-terrain").style.display = "none";
			selected.innerHTML = terrain.innerHTML;
			selected.style.display = "";
			selected.dataset.id = e.target.dataset.id;
		})
		$(".search-result-terrain").appendChild(terrain);
	}
})

// 搜索
$(".search-box-image").addEventListener("keyup", (e) => {
	const images = $$(".search-result");
	for (let element of images) 
		if (element.dataset.type === "IMAGERY")
			if (element.innerHTML.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
				element.style.display = "";
			} else
				element.style.display = "none";
})
$(".search-box-terrain").addEventListener("keyup", (e) => {
	const terrains = $$(".search-result");
	for (let element of terrains) 
		if (element.dataset.type === "TERRAIN")
			if (element.innerHTML.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
				element.style.display = "";
			} else
				element.style.display = "none";
})

// 矢量图层类型选择
const vectorDataType = $("#vector-data-type");
const chosenVectorData = $("#chosen-vector-file");
vectorDataType.addEventListener("change", (e) => {
	if (e.target.value === "unchosen") {
		$("#vector-choose-msg").style.display = "none";
		chosenVectorData.style.display = "none";
	} else {
		$("#vector-choose-msg").style.display = "";
		chosenVectorData.style.display = "";
		switch (vectorDataType.value) {
			case "geojson": 
				chosenVectorData.accept = ".geojson"; break;
			case "gltf":
				// todo 
			case "3dtiles":
				// todo
		}
	}
})

// 矢量图层加载
$("#load-vector-button").addEventListener("click", (e) => {
	e.preventDefault();
	const fileInput = $("#chosen-vector-file");
	let data, file;
	// 错误信息
	const typeError = $("#vector-type-error-msg");

	if (!fileInput.value || vectorDataType.value === "unchosen") {
		typeError.innerHTML = "没有选择文件！";
		typeError.classList.add("error-msg");
	} else {
		file = fileInput.files[0];
		let reader = new FileReader();
		reader.onload = (e) => {data = e.target.result;};
		read.readAsDataURL(file);
		switch (vectorDataType.value) {
			case "geojson":
				viewer.dataSources.add(
					data, {
						stroke: Cesium.Color.BLUE,
						fill: Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
						strokeWidth: 5,
					}
				)
				break;
		}
	}
})