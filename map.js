import Map from "ol/Map";
import View from "ol/View";
import TileWMS from "ol/source/TileWMS"
import Tile from "ol/layer/Tile"
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";

let map = new Map({
	target: "map",
	view: new View({
		center: fromLonLat([120, 30]),
		zoom: 8
	})
});

let baseOSM = new TileLayer({
	source: new OSM()
})
map.addLayer(baseOSM);

let hangzhou_img = new Tile({
	source: new TileWMS({
		url: 'http://localhost:8080/geoserver/WebGIS/wms',
		params: {'FORMAT': "image/png", 
			tiled: true,
			"STYLES": '',
			"LAYERS": 'WebGIS:hangzhou_img',
			tilesOrigin: 756765 + "," + 3306285
		}
	})
});
map.addLayer(hangzhou_img);

let hangzhou_outline = new Tile({
	source: new TileWMS({
		url: 'http://localhost:8080/geoserver/WebGIS/wms',
		params: {
			"FORMAT": "image/png",
			tiled: true,
			"LAYERS": 'WebGIS:hangzhou_outline',
		}
	})
});
map.addLayer(hangzhou_outline);