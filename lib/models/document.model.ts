import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    id:String,
    data:Object,
    imgUrl:String,
    title:String,
    description:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    type:String
});

const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);

export default Document;