// 存储数据的类
class DataSet {
	constructor(dataType, useStand, stand) {
		this.dataType = dataType;
		this.scale = [...globalScale];
		if (!useStand) {
			this.stand = stand;
		} else {
			this.stand = undefined;
		}
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
	coverage.appendChild(new_cover);
}

// 用到的标签选择器
const loadBtn = document.querySelector("#load-btn");
const scaleCheckbox = document.getElementById("use-scale");
const standCheckbox = document.getElementById("use-stand");
const rightTopScale = document.querySelectorAll(".right-top-scale");
const leftBottomScale = document.querySelectorAll(".left-bottom-scale");
const typeList = document.getElementById("data-type");
const stand = document.getElementById("stand");
const coverage = document.querySelector(".covers");

// 存储图层的数组和存储当前视图坐标的数组
let covers = [];
let globalScale;

// 错误信息显示
const typeError = document.querySelector("#type-error-msg");
const scaleError = document.querySelector("#scale-error-msg");
const standError = document.querySelector("#stand-error-msg");

// 加载按钮点击事件
loadBtn.addEventListener("click", (event) => {
	event.preventDefault();
	let finish = true;

	// 显示错误信息
	if (typeList.value === "unchosen") {
		typeError.textContent = "请选择数据类型";
		typeError.classList.add("error-msg");
		typeList.style.boxShadow = "0 0 3px red";
		finish = false;
	}
	if (stand.value === "unchosen" && standCheckbox.checked === false) {
		standError.textContent = "请选择站位";
		standError.classList.add("error-msg");
		stand.style.boxShadow = "0 0 3px red";
		finish = false;
	}
	if ((leftBottomScale[0].value == 0 || leftBottomScale[1].value == 0 || rightTopScale[0].value == 0 || rightTopScale[1].value == 0) && scaleCheckbox.checked === false || 
		globalScale === undefined && scaleCheckbox.checked === true) {
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
		for (let element of leftBottomScale) {element.style.boxShadow = "0 0 3px gray";}
		for (let element of rightTopScale) {element.style.boxShadow = "0 0 3px gray";}
		if (scaleCheckbox.checked === false) {
			globalScale = [leftBottomScale[0].value, leftBottomScale[1].value, rightTopScale[0].value, rightTopScale[1].value];
		}
		covers.push(new DataSet(typeList.value, standCheckbox.checked, stand.value));
		document.querySelector("form").reset();
		createCover(covers[covers.length - 1]);
	} else {
		document.querySelector(".row-resize-bar").style.height = "400px";
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
	const dragList = document.querySelectorAll(".cover");
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
	const dragList = document.querySelectorAll(".cover");
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