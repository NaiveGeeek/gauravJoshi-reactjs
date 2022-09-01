import axios from "axios"
import { apiParam } from "./types"

export const makeRequest = ({url='',method='get',options={}}:apiParam) =>{
    return axios({
        url:`https://upayments-studycase-api.herokuapp.com/api${url}`,
        method:method,
        data:options.data,
        params:options.queryParam,
        headers:{
            'Authorization':`Bearer ${process.env.REACT_APP_TOKEN}`
        }
    }).then((response)=>{
        if(options.cb){
            options.cb({data:response.data,isError:false});
        }
    }).catch((error)=>{
        if(options.cb){
            options.cb({data:undefined,isError:true});
        }
        console.log(error);
    });
}

