import request from "request-promise";
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNjlmODZhZi1mM2M3LTRlMGItOTgwYS1kMDNhZDYyYzg1NDMiLCJpZCI6ODY0NDYsImlhdCI6MTY0OTA2Mjk4MH0.jIZm-ercN4v1ujp9Eh8jEhj9YfR7ri22ZK1c3BWx1zI";
const reponse = await request({
	url: "http://api.cesium.com/v1/assets",
	headers: {Authorization: `Bearer ${accessToken}`},
	json: true
})