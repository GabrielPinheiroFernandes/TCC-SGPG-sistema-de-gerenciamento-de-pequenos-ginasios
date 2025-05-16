import api from '../../constants/api'
import axios from 'axios';

function LoginRequest(email, password) {
    body={
        "email": email,
        "password": password
    }
    response=axios.post(api.Url+"/api/auth/login", body)

    return response
}