const mongoose = require('mongoose'); // Erase if already required
// Declare the Schema of the Mongo model
var roomSchema = new mongoose.Schema({
    nameRoom:{
        type:String,
        required:true,
        unique: true,
    },
    icUrl: {
        type: String,
        required: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        defaul: [],
    }],
}, {
    collection: "rooms",
    timestamps: true,
}
);

//Export the model
module.exports = mongoose.model('Room', roomSchema);