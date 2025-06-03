import axios from 'axios';
import urls from '../../constants/urls';

function LoginRequest(email, password) {
    body={
        "email": email,
        "password": password
    }
    response=axios.post(urls.UrlApi+"/api/auth/login", body)

    return response
}

function GetUser(id, token) {
    response=axios.get(urls.UrlApi+"/user/"+id, {headers: {'Authorization': 'Bearer '+token}})
    return response
}

export {LoginRequest, GetUser}