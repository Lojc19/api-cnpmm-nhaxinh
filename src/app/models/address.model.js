const mongoose = require('mongoose'); // Erase if already required
// Declare the Schema of the Mongo model
var addressSchema = new mongoose.Schema({
    nameAddress: {
        type: String,
        required: true,
        unique: true,
    },
    province:{
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    ward: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: "",
    },
    default: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {
    collection: "address",
    timestamps: true,
}
);

//Export the model
module.exports = mongoose.model('Address', addressSchema);