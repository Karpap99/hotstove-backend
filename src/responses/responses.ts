import { User } from "src/entity/user.entity"

interface baseResponse {
    status: string,
    code: number,
    message: string
}


interface AuthResponseSuccess extends baseResponse {
    data: {
        token: string;
    }
}

interface AuthResponseError extends baseResponse {
    data: {
        errors: string;
    }
}



export {AuthResponseError, AuthResponseSuccess}