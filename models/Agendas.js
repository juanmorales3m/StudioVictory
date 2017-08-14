var mongoose = require('mongoose');

var cartelSchema = new mongoose.Schema({
	
	nombre: String,
	telefono:  String,
	direccion: String,
	correo: String
	

});

mongoose.model('Agendas', cartelSchema);