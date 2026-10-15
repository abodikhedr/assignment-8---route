


export const create = async ({model,data,options={}}={})=>{
    return await model.create([data],options)
}
export const findOne = async ({model,filter,options={}}={})=>{
    return await model.findOne(filter,options)
}


export const findById = async ({model,id,options={}}={})=>{
    return await model.findById(id,options)
}


export const findByIdAndUpdate = async ({model,id,update,options={}}={})=>{
    return await model.findByIdAndUpdate(id,update,{new:true,runValidators:true,...options})
}

export const findOneAndDelete = async ({model,filter}={})=>{
    return await model.findOneAndDelete(filter)
}