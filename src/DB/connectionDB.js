import mongoose from 'mongoose';



const connectionDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/saraha_app',{
            serverSelectionTimeoutMS:5000
        });
        console.log("database connected successfuly");
        
    } catch (error) {
        console.log("database failed to connect");
        
    }
}


export default connectionDB







