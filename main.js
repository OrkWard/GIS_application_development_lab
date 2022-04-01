// 覆盖Jquery自带的$变量
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
	attributes.textContent = (`图层${covers.length}${cover.dataType}`);
	attributes.classList.add("cover-name");
	attributes.style.pointerEvents = "none";
	new_cover.appendChild(attributes);
	
	// 创建图层站位
	attributes = document.createElement("p");
	if (cover.stand === undefined) {
		attributes.textContent = "无站位";
	} else {
		attributes.textContent = (`站位：${cover.stand}`)
	}
	attributes.classList.add("cover-stand");
	attributes.style.pointerEvents = "none";
	new_cover.appendChild(attributes);
	new_cover.classList.add("cover");

	// 创建标签属性以存储顺序
	new_cover.dataset.sortIndex = covers.length;

	// 允许拖拽
	new_cover.draggable = true;

	new_cover.oncontextmenu = onContentMenu;
	coverage.appendChild(new_cover);
}

// 用到的标签选择器
const loadBtn = $("#load-btn");
const scaleCheckbox = document.getElementById("use-scale");
const standCheckbox = document.getElementById("use-stand");
const rightTopScale = $$(".right-top-scale");
const leftBottomScale = $$(".left-bottom-scale");
const typeList = document.getElementById("data-type");
const stand = document.getElementById("stand");
const coverage = $(".covers");

// 存储图层的数组和存储当前视图坐标的数组
let covers = [];

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
	}
	if (stand.value === "unchosen" && standCheckbox.checked === false) {
		standError.textContent = "请选择视角";
		standError.classList.add("error-msg");
		stand.style.boxShadow = "0 0 3px red";
		finish = false;
	}
	if ((leftBottomScale[0].value == 0 || leftBottomScale[1].value == 0 || rightTopScale[0].value == 0 || rightTopScale[1].value == 0) && scaleCheckbox.checked === false) {
		scaleError.textContent = "请完整填写空间范围";
		scaleError.classList.add("error-msg");
		for (let element of leftBottomScale) {element.style.boxShadow = "0 0 3px red";}
		for (let element of rightTopScale) {element.style.boxShadow = "0 0 3px red";}
		finish = false;
	}

	// 显示错误信息后调整高度，或者添加标签
	if (finish) {
		typeError.textContent = scaleError.textContent = standError.textContent = "";
		typeList.style.boxShadow = "0 0 3px gray";
		stand.style.boxShadow = "0 0 3px gray";
		for (let element of leftBottomScale) {element.style = "";}
		for (let element of rightTopScale) {element.style = "";}
		if (typeList.value === "image") {
			covers.push(new DataSet($(".selected-result-image").dataset.id, $(".selected-result-image").dataset.name));
		} else if (typeList.value === "terrain") {
		}
		$("form").reset();
		stand.disabled = false;
		// createCover(covers[covers.length - 1]);
	} else {
		$(".row-resize-bar").style.height = "400px";
	}
})

// 两个选择按钮事件
scaleCheckbox.addEventListener("click", (event) => {
	if (event.target.checked === true) {
		for (let element of leftBottomScale) {
			element.disabled = true;
		}
		for (let element of rightTopScale) {
			element.disabled = true;
		}
	} else {
		for (let element of leftBottomScale) {element.disabled = false;}
		for (let element of rightTopScale) {element.disabled = false;}
	}
})

standCheckbox.addEventListener("click", (event) => {
	if (event.target.checked === true) {
		stand.disabled = true;
	} else {
		stand.disabled = false;
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
	if (dragIndex < enterIndex) {
		dragObj.remove();
		enterObj.after(dragObj);
	} else if (dragIndex > enterIndex) {
		dragObj.remove();
		enterObj.before(dragObj);
	}
})

function onContentMenu(event) {
	event.preventDefault();
	const menuObj = document.getElementById("menu");

	// 显示菜单
	menuObj.style.display = "block";
	menuObj.style.left = event.clientX + "px";
	menuObj.style.top = event.clientY + "px";
	focusObj = event.target;
} 

// 关闭菜单
window.onclick = (event) => {
	const menuObj = document.getElementById("menu");
	menuObj.style.display = "none";
}

let focusObj;

// 删除
const deleteBtn = $("#delete");
deleteBtn.addEventListener("click", (event) => {
	focusObj.remove();
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

// 交换上下显示
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

