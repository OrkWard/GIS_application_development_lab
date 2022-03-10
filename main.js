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

function createCover(cover) {
	
}


let loadBtn = document.querySelector("#load-btn");
let scaleCheckbox = document.getElementById("use-scale");
let standCheckbox = document.getElementById("use-stand");
let rightTopScale = document.querySelectorAll(".right-top-scale");
let leftBottomScale = document.querySelectorAll(".left-bottom-scale");
let typeList = document.getElementById("data-type");
let stand = document.getElementById("stand");

let covers = [];
let coverNumber = 0;
let globalScale;

let typeError = document.querySelector("#type-error-msg");
let scaleError = document.querySelector("#scale-error-msg");
let standError = document.querySelector("#stand-error-msg");

loadBtn.addEventListener("click", (event) => {
	event.preventDefault();
	let finish = true;
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
	} else {
		document.querySelector(".row-resize-bar").style.height = "400px";
	}
	document.querySelector("form").reset();
})

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