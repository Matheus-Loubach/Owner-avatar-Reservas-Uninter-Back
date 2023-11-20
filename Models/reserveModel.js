const mongoose = require("mongoose");

const { Schema } = mongoose;

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    idUser: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        require: true,
    }
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);

module.exports = {
    Service,
    serviceSchema,
};
