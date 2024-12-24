import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
    return axios.get(baseUrl).then((res) => res.data);
};

const createPerson = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(res => res.data);
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(res => res.data); // the deleted thingo
}

const updatePerson = (id, updatedObject) => {
    const request = axios.put(`${baseUrl}/${id}`, updatedObject);
    return request.then(r => r.data) // the updated thingo
}

export default {
    getAll,
    createPerson,
    deletePerson,
    updatePerson,
};
