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
	attributes.classList.add("cover-stand");
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
const loadBtn = $("#load-btn");
const scaleCheckbox = document.getElementById("use-scale");
const standCheckbox = document.getElementById("use-stand");
const longtitude = $(".camera-longtitude");
const latitude = $(".camera-latitude");
const height = $(".camera-height");
const typeList = document.getElementById("data-type");
const horizon = $(".rotate-horizon");
const vertical = $(".rotate-vertical");
const coverage = $(".covers");

// 存储图层的数组和存储当前视图坐标的变量
let covers = [];
let position;

// 错误信息显示
const typeError = $("#type-error-msg");
const scaleError = $("#scale-error-msg");
const standError = $("#stand-error-msg");

// 加载按钮点击事件
loadBtn.addEventListener("click", (event) => {
	event.preventDefault();
	// 是否错误
	let finish = true;

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
	}
	if ((horizon.value == "" || vertical.value == "") && standCheckbox.checked === false) {
		standError.textContent = "请完整填写视角";
		standError.classList.add("error-msg");
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
		typeError.textContent = scaleError.textContent = standError.textContent = "";
		$(".search-box-image").style.boxShadow = "";
		typeList.style.boxShadow = "0 0 3px gray";
		vertical.style.boxShadow = "0 0 3px gray";
		horizon.style.boxShadow = "0 0 3px gray";
		latitude.style = "";
		longtitude.style = "";
		height.style = "";
		if (typeList.value === "image") {
			covers.push(new DataSet($(".selected-result-image").dataset.id, $(".selected-result-image").dataset.name));
		} else if (typeList.value === "terrain") {
		}
		// 添加标签和图层
		createCover(covers[covers.length - 1]);

		// 更改位置
		if (!scaleCheckbox.checked && !standCheckbox.checked) {
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
		horizon.disabled = false;
		vertical.disabled = false;
		latitude.disabled = false;
		longtitude.disabled = false;
		height.disabled = false;
		$("form").reset();
	} else {
		$(".row-resize-bar").style.height = "500px";
	}
})

// 两个选择按钮事件，禁用功能
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

standCheckbox.addEventListener("click", (event) => {
	if (event.target.checked === true) {
		horizon.disabled = true;
		vertical.disabled = true;
	} else {
		horizon.disabled = false;
		vertical.disabled = false;
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
		event.target.classList.add("hold");
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
	if (/hold/.test(event.target.classList)) {
		event.target.classList.remove("hold");
	}
})

coverage.addEventListener("drop", (event) => {
	event.preventDefault();
	event.target.classList.remove("hold");

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
class Status {
	constructor(onDisplay, position) {
		this.onDisplay = onDisplay;
		this.position = position;
	}
}

const stateLoad = new Status(true, "upper");
const stateCoverage = new Status(true, "lower");
const loadButton = $("#load-tool");
const coverageButton = $("#coverage-tool");

// 改变显示状态
function changeDisplay(State) {
	switch (openToolNumber) {
		case 0:
			if (State.position === "upper") {
				exchange();
			}
			$(".left").style.display = "";
			State.onDisplay = true;
			openToolNumber = 1;
			break;
		case 1:
			if (State.onDisplay) {
				$(".left").style.display = "none";
				openToolNumber = 0;
				State.onDisplay = false;
			} else {
				$(".upper").style.display = "";
				exchange();
				openToolNumber = 2;
				State.onDisplay = true;
			}
			break;
		case 2:
			if (State.onDisplay) {
				if (State.position === "upper") {
					$(".upper").style.display = "none";
					State.onDisplay = false;
				} else {
					exchange();
					$(".upper").style.display = "none";
					State.onDisplay = false;
				}
				openToolNumber = 1;
			}
	}
}

// 交换上下工具显示
function exchange() {
	const upper = $(".upper");
	const lower = $(".lower");
	const upperContent = upper.lastElementChild;
	const lowerContext = lower.firstElementChild;
	upperContent.remove();
	lowerContext.remove();
	upper.appendChild(lowerContext);
	lower.appendChild(upperContent);
	upperContent.classList.remove("upper-content");
	lowerContext.classList.add("upper-content");
	[stateCoverage.position, stateLoad.position] = [stateLoad.position, stateCoverage.position];
}

loadButton.addEventListener("click", (event) => {
	changeDisplay(stateLoad);
});
coverageButton.addEventListener("click", (event) => {
	changeDisplay(stateCoverage);
});

// 切换数据加载面板样式
$("#data-type").addEventListener("change", (event) => {
	event.preventDefault();
	if (event.target.value === "unchosen") {
		$(".search-box-image").style.display = "none";
		$(".search-result-image").style.display = "none";
		$(".selected-result-image").style.display = "none";
		$(".search-box-terrain").style.display = "none";
		$(".search-result-terrain").style.display = "none";
		$(".selected-result-terrain").style.display = "none";
	} else if (event.target.value === "image") {
		$(".search-box-image").style.display = "";
		$(".search-result-image").style.display = "";
		$(".search-box-terrain").style.display = "none";
		$(".search-result-terrain").style.display = "none";
		$(".selected-result-terrain").style.display = "none";
	} else if (event.target.value === "terrain") {
		$(".search-box-image").style.display = "none";
		$(".search-result-image").style.display = "none";
		$(".selected-result-image").style.display = "none";
		$(".search-box-terrain").style.display = "";
		$(".search-result-terrain").style.display = "";
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
