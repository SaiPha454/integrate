
/**
 * Map the array return by the redis and convert them to the key value pair array.
 * @param {array} arr - array return by the redis
 * @returns []
 */
const redis_array_mapper=(arr=[])=>{

    let result = [];
    
    arr.map((element,index)=>{

        let check = index % 2;

       if( check == 0 ){

           let pos = index / 2 ;

           result[`${pos}`]={
               keyword: arr[index],
               score: arr[index + 1]
           }
       }
    
    });

    return result;
}

module.exports={
    redis_array_mapper
}