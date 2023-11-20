const mongoose = require("mongoose");

async function main(){

    try {
         mongoose.set("strictQuery", true)

        await mongoose.connect("mongodb+srv://loubach:UnwTGewaDuPOyzNI@cluster0.vvf58ej.mongodb.net/?retryWrites=true&w=majority");
        console.log("Banco Conectado", mongoose.connection.host);
    } catch (error) {
        console.log(`error: ${error}`);
    }
}


module.exports = main