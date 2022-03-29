window.CESIUM_BASE_URL = '/';

import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

// allocate token and initialize viewer
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmZmODFjMS0yMTA5LTQ4ZGQtODY1MS0wZDMzNGUxODk5NWEiLCJpZCI6ODY0NDYsImlhdCI6MTY0NzgzMzEzNn0.Z6RZYH594BXEBh2a5LwKCF7fw5NhlSCRxnibcOz9O8k";
const viewer = new Cesium.Viewer("cesium-container", {
});
