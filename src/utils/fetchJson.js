import fetch from "node-fetch";

const fetchJson = (...args) => fetch(...args).then(response => response.json());

export default fetchJson;
