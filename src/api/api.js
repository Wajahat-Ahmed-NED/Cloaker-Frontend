import axios from '../../node_modules/axios/index';
// import { isJwtExpired } from 'jwt-check-expiration';

const api = 'http://172.168.10.112/node_app/';
const api2 = 'http://localhost:2001/';
var token;
var groupName;
var type;

const getToken = () => {
    let data = JSON.parse(localStorage.getItem('clientToken'));
    token = data?.token;
    groupName = data?.groups;
    if (groupName === 'SOC L2') {
        groupName = 'SOC';
    }
    if (isJwtExpired(token)) {
        localStorage.removeItem('clientToken');
        window.location.replace('/login');
        return true;
    } else {
        return false;
    }
};

// const clientToken = localStorage.getItem('clientToken');

async function getCountries() {
    // if (getToken() !== true) {
    return await axios.get(`${api2}getCountries`);
    // }
}
async function getCountriesById(obj) {
    // if (getToken() !== true) {
    return await axios.post(`${api2}getCountriesById`, obj);
    // }
}
async function signIn(obj) {
    // if (getToken() !== true) {
    return await axios.post(`${api2}signIn`, obj);
    // }
}
async function setURL(obj) {
    // if (getToken() !== true) {
    return await axios.put(`${api2}setURL`, obj);
    // }
}
async function updateBlock(obj) {
    // if (getToken() !== true) {
    return await axios.put(`${api2}updateBlock`, obj);
    // }
}
async function blockAll(obj) {
    // if (getToken() !== true) {
    return await axios.put(`${api2}blockAll`, obj);
    // }
}
async function changePassword(obj) {
    // if (getToken() !== true) {
    return await axios.post(`${api2}changePassword`, obj);
    // }
}
async function createThirdURL(obj) {
    // if (getToken() !== true) {
    return await axios.post(`${api2}createThirdURL`, obj);
    // }
}
async function cloakerApi(obj) {
    // if (getToken() !== true) {
    return await axios.post(`${api2}cloakerApi`, obj);
    // }
}

export { getCountries, getCountriesById, signIn, setURL, updateBlock, blockAll, changePassword, cloakerApi, createThirdURL };
