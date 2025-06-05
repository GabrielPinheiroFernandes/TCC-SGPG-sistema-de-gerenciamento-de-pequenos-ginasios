import axios from 'axios';
import urls from '../../constants/urls';

async function LoginRequest(email, password) {
    const body = {
        email: email,
        password: password
    };
    const response = await axios.post(urls.UrlApi + "/api/auth/login", body);
    return response.data; // <-- Aqui está o JSON já processado
}

async function GetUser(id, token) {
    const response = await axios.get(urls.UrlApi + "/user/" + id, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    return response.data; // <-- Aqui também
}

export { LoginRequest, GetUser };
