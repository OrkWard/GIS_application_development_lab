const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// 存储数据的类
class DataSet {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
}

// 为加载的数据新键一个标签插入coverage下
function createCover(cover) {
	const new_cover = document.createElement("div");
	let attributes;

	// 创建图层名
	attributes = document.createElement("p");
	attributes.textContent = (`${cover.name}`);
	attributes.classList.add("cover-name");
	attributes.style.pointerEvents = "none";
	new_cover.appendChild(attributes);
	
	// 创建图层id
	attributes = document.createElement("p");
	attributes.textContent = (`影像id：${cover.id}`)
	attributes.classList.add("cover-id");
	attributes.style.pointerEvents = "none";
	new_cover.appendChild(attributes);
	new_cover.classList.add("cover");

	// 创建标签属性以存储id
	new_cover.dataset.id = cover.id;

	// 允许拖拽
	new_cover.draggable = true;

	// 将图层插入最底端
	viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({assetId: cover.id}), 0);

	new_cover.oncontextmenu = onContentMenu;
	coverage.appendChild(new_cover);
}

// 用到的标签选择器
const scaleCheckbox = document.getElementById("use-scale");
const viewCheckbox = document.getElementById("use-view");
const longtitude = $(".camera-longtitude");
const latitude = $(".camera-latitude");
const height = $(".camera-height");
const typeList = document.getElementById("grid-data-type");
const horizon = $(".rotate-horizon");
const vertical = $(".rotate-vertical");
const coverage = $(".covers");
const terrainCheckbox = $("#act-terrain");

// 存储图层的数组和存储当前视图坐标的变量
let covers = [];
let position;

// 加载按钮点击事件
$("#load-grid-button").addEventListener("click", (event) => {
	event.preventDefault();
	// 是否错误
	let finish = true;
	// 错误信息显示
	const typeError = $("#grid-type-error-msg");
	const scaleError = $("#scale-error-msg");
	const viewError = $("#view-error-msg");


	// 显示错误信息
	if (typeList.value === "unchosen") {
		typeError.textContent = "请选择数据类型";
		typeError.classList.add("error-msg");
		typeList.style.boxShadow = "0 0 3px red";
		finish = false;
	} else if (typeList.value === "image" && $(".selected-result-image").innerHTML == "") {
		typeError.textContent = "请选择数据";
		typeError.classList.add("error-msg");
		$(".search-box-image").style.boxShadow = "0 0 3px red";
	} else if (typeList.value === "terrain" && $(".selected-result-terrain").innerHTML == "") {
		typeError.textContent = "请选择数据";
		typeError.classList.add("error-msg");
		$(".search-box-image").style.boxShadow = "0 0 3px red";
	}

	if ((horizon.value == "" || vertical.value == "") && viewCheckbox.checked === false) {
		viewError.textContent = "请完整填写视角";
		viewError.classList.add("error-msg");
		horizon.style.boxShadow = "0 0 3px red";
		vertical.style.boxShadow = "0 0 3px red";
		finish = false;
	}
	if ((latitude.value == "" || longtitude.value == "" || height.value == "") && scaleCheckbox.checked === false) {
		scaleError.textContent = "请完整填写空间范围";
		scaleError.classList.add("error-msg");
		latitude.style.boxShadow = "0 0 3px red";
		longtitude.style.boxShadow = "0 0 3px red";
		height.style.boxShadow = "0 0 3px red";
		finish = false;
	}

	// 显示错误信息后调整高度，或者添加标签
	if (finish) {
		// 关闭错误样式
		typeError.textContent = scaleError.textContent = viewError.textContent = "";
		$(".search-box-image").style.boxShadow = "";
		$(".search-box-terrain").style.boxShadow = "";
		typeList.style.boxShadow = "0 0 3px gray";
		vertical.style.boxShadow = "0 0 3px gray";
		horizon.style.boxShadow = "0 0 3px gray";
		latitude.style = "";
		longtitude.style = "";
		height.style = "";
		if (typeList.value === "image") {
			covers.push(new DataSet($(".selected-result-image").dataset.id, $(".selected-result-image").dataset.name));

			// 添加标签和图层
			createCover(covers[covers.length - 1]);
		} else if (typeList.value === "terrain") {
			if (terrainCheckbox.checked === false)
				viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
			else {
				viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
					url: Cesium.IonResource.fromAssetId($(".selected-result-terrain").dataset.id),
					requestVertexNormals: $("#act-light").checked,
					requestWaterMask: $("#act-water").checked
				})
			}
		}

		// 更改位置
		if (!scaleCheckbox.checked && !viewCheckbox.checked) {
			position = Cesium.Cartesian3.fromDegrees(longtitude.value, latitude.value, height.value);
			viewer.camera.flyTo({
				destination: position,
				orientation: {
					heading: Cesium.Math.toRadians(horizon.value),
					pitch: Cesium.Math.toRadians(vertical.value)
				}
			})
		} else if (!scaleCheckbox.checked) {
			viewer.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(longtitude.value, latitude.value, height.value),
				})
		}

		// 清空表单
		$(".selected-result-image").style.display = "none";
		$(".selected-result-terrain").style.display = "none";
		$(".search-box-terrain").disabled = false;
		horizon.disabled = false;
		vertical.disabled = false;
		latitude.disabled = false;
		longtitude.disabled = false;
		height.disabled = false;
		$("#load-grid-tool").reset();
		$(".search-image").style.display = $(".search-terrain").style.display = "none";
	} else {
		$(".row-resize-bar").style.height = "600px";
	}
})

// 三个选择按钮事件，禁用功能
scaleCheckbox.addEventListener("click", (event) => {
	if (event.target.checked === true) {
		latitude.disabled = true;
		longtitude.disabled = true;
		height.disabled = true;
	} else {
		latitude.disabled = false;
		longtitude.disabled = false;
		height.disabled = false;
	}
})
viewCheckbox.addEventListener("click", (event) => {
	if (event.target.checked === true) {
		horizon.disabled = true;
		vertical.disabled = true;
	} else {
		horizon.disabled = false;
		vertical.disabled = false;
	}
})
terrainCheckbox.addEventListener("click", (e) => {
	if (e.target.checked === false) {
		$(".search-box-terrain").disabled = true; 
		$(".search-result-terrain").style.display = "none";
	}
	else {
		$(".search-box-terrain").disabled = false; 
		$(".search-result-terrain").style.display = "";
	}
})

// 图层拖拽部分，各类事件
let dragObj, enterObj, dragIndex, enterIndex;

coverage.addEventListener("dragstart", event => {
	dragObj = event.target;
	const dragList = $$(".cover");
	dragList.forEach((item, index) => {
		if (item === event.target) {
			dragIndex = index;
		}
	})
	event.target.style.opacity = 0.5;
})

coverage.addEventListener("dragend", (event) => {
	event.target.style.opacity = "";
})

coverage.addEventListener("dragover", (event) => {
	event.preventDefault();
})

coverage.addEventListener("dragexit", (event) => {
	event.preventDefault();
})

coverage.addEventListener("dragenter", (event) => {
	if (event.target.className === "cover") {
		event.target.classList.add("cover-hold");
	}
	enterObj = event.target;
	const dragList = $$(".cover");
	dragList.forEach((item, index) => {
		if (item === event.target) {
			enterIndex = index;
		}
	});
})

coverage.addEventListener("dragleave", (event) => {
	if (/cover-hold/.test(event.target.classList)) {
		event.target.classList.remove("cover-hold");
	}
})

coverage.addEventListener("drop", (event) => {
	event.preventDefault();
	event.target.classList.remove("cover-hold");

	// 调整标签顺序
	if (dragIndex < enterIndex) {
		dragObj.remove();
		enterObj.after(dragObj);
	} else if (dragIndex > enterIndex) {
		dragObj.remove();
		enterObj.before(dragObj);
	}

	// 调整图层顺序
	dragIndex = viewer.imageryLayers.length - dragIndex - 1;
	enterIndex = viewer.imageryLayers.length - enterIndex - 1;
	const dragLayer = viewer.imageryLayers.get(dragIndex);
	viewer.imageryLayers.remove(dragLayer, false);
	if (dragIndex < enterIndex) {
		viewer.imageryLayers.add(dragLayer, enterIndex + 1);
	} else {
		viewer.imageryLayers.add(dragLayer, enterIndex);
	}
})

// 被拖动的标签和位置
let focusObj, focusIndex;
// 右键菜单
function onContentMenu(event) {
	event.preventDefault();
	const menuObj = document.getElementById("menu");

	// 显示菜单
	menuObj.style.display = "block";
	menuObj.style.left = event.clientX + "px";
	menuObj.style.top = event.clientY + "px";
	focusObj = event.target;
	const coverList = $$(".cover");
	coverList.forEach((element, index) => {
		if (element === event.target) focusIndex = index;
	})
} 

// 关闭菜单
window.onclick = (event) => {
	const menuObj = document.getElementById("menu");
	menuObj.style.display = "none";
}

// 删除
const deleteBtn = $("#delete");
deleteBtn.addEventListener("click", (event) => {
	focusObj.remove();
	viewer.imageryLayers.remove(viewer.imageryLayers.get(viewer.imageryLayers.length - focusIndex - 1));
})

// 切换透明度
$(".range-bar").addEventListener("change", (e) => {
	viewer.imageryLayers.get(viewer.imageryLayers.length - focusIndex - 1).alpha = e.target.value / 100;
})

// 工具显示状态
let openToolNumber = 2;
let focusTool;
const toolsId = ["coverage", "grid", "vector"]
$("#load-grid-tool").dataset.toolId = toolsId[1];
$("#load-vector-tool").dataset.toolId = toolsId[2];
$("#coverage-tool").dataset.toolId = toolsId[0];
const tools = $$(".tool");
const upper = $(".upper");
const lower = $(".lower");
const toolsColletction = $("#tools-collection");
tools.forEach((element) => {
	element.dataset.onDisplay = false;
})

// 交换上下工具显示
function exchange() {
	const upperContent = upper.lastElementChild;
	const lowerContext = lower.firstElementChild;
	upper.appendChild(lowerContext);
	lower.appendChild(upperContent);
	upperContent.classList.remove("row-resize-content");
	lowerContext.classList.add("row-resize-content");
	[stateCoverage.position, stateLoad.position] = [stateLoad.position, stateCoverage.position];
}

// 改变显示状态
function changeDisplay(e) {
	tools.forEach((element) => {
		if (element.dataset.toolId === e.target.toolId) focusTool = element;
	})
	switch (openToolNumber) {
		case 0:
			$(".left").style.display = "";
			upper.style.display = "none";
			lower.appendChild(focusTool);
			focusTool.dataset.onDisplay = true;
			openToolNumber = 1;
			break;
		case 1:
			if (lower.lastElementChild.dataset.toolId === e.target.toolId) focusTool = lower.lastElementChild;
			if (focusTool.dataset.onDisplay) {
				lower.classList.remove("row-resize-content");
				toolsColletction.appendChild(lower.lastElementChild);
				lower.style.display = "none";
				openToolNumber = 0;
				focusTool.dataset.onDisplay = false;
			} else {
				upper.appendChild(focusTool);
				exchange();
				upper.style.display = "";
				focusTool.dataset.onDisplay = true;
				openToolNumber = 2;
			}
			break;
		case 2:
			if (upper.lastElementChild.dataset.toolId === e.target.toolId) focusTool = upper.lastElementChild;
			if (lower.lastElementChild.dataset.toolId === e.target.toolId) focusTool = lower.lastElementChild;
			if (focusTool.dataset.onDisplay) {
				if (!upper.lastElementChild.toolId === focusTool.dataset.toolId) {
					exchange();
				}
				upper.style.display = "none";
				focusTool.dataset.onDisplay = false;
				focusTool.classList.remove("row-resize-content");
				toolsColletction.appendChild(focusTool);
				openToolNumber = 1;
			} else {
				toolsColletction.appendChild(lower.lastElementChild);
				lower.appendChild(focusTool);
				focusTool.dataset.onDisplay = true;
			}
			break;
	}
	console.log(focusTool);
}

$$(".tools-bar-icon").forEach((element, index) => {
	element.dataset.toolId = toolsId[index];
	element.addEventListener("click", changeDisplay)
})
upper.appendChild($("#load-vector-tool"));
upper.lastElementChild.classList.add("row-resize-content");
lower.appendChild($("#coverage-tool"));

// 切换数据加载面板样式
$("#grid-data-type").addEventListener("change", (event) => {
	event.preventDefault();
	if (event.target.value === "unchosen") {
		$(".search-image").style.display = "none";
		$(".search-terrain").style.display = "none";
	} else if (event.target.value === "image") {
		$(".search-image").style.display = "";
		$(".search-box-image").style.display = "";
		$(".search-result-image").style.display = "";
		$(".search-terrain").style.display = "none";
		$(".selected-result-image").style.display = "none";
	} else if (event.target.value === "terrain") {
		$(".search-image").style.display = "none";
		$(".search-terrain").style.display = "";
		$(".search-result-terrain").style.display = "";
		$(".search-box-terrain").style.display = "";
		$(".selected-result-terrain").style.display = "none";
	}
})