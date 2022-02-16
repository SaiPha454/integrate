
/**
 * 
 * @param {number} status - return status code 
 * @param {string} message - response message
 * @param {object} meta - reponse meta data
 * @param {object} data - reponse main data
 * @returns 
 */
const commonResponse = (status = 200,message,meta=null,data=null)=>{

    let resp={
        status: status,
        message: message
    }

    //if meta is not null
    if(meta != null){
        resp.meta = meta;
    }
    //if data is not null
    if(data != null){
        resp.data = data;
    }

    return resp;
}
/**
 * 
 * @param {number} status - response statuscode
 * @param {string} message - response message 
 * @returns 
 */
const commonErrorResponse=(status=400,message="error occurs")=>{
    return {
        status: status,
        message: message
    }
}


module.exports={
    commonResponse,
    commonErrorResponse
}