var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");

//variable que controla el pool de conexiones
var pool = configdb.configdb();

//metodo que se llama despues de invocar por POST a la pagina
//la funcion anonima que resive tiene tres parametros
//req que es la peticion
//res que esla respuesta
//next que es la siguiente function
router.get('/', function(req, res, next) {
  //esta variable es la que contien la consulta a realizarse en la DB
  if(req.query.c == 1){
    var sql='select anio,cant_docentes_tc,cant_docentes_hc,relacion_docentes,"sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" from "Datawarehouse"."KPI_Relacion_Docentes" join manuales_indicadores on "manual_Rela"=codigo order by anio desc';

  }
  else return console.log("error");
  //aquui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde serealiza el query de la DB
    //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql, function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //se conprueba si existe resultado
      //si es mayor a 0 se crea la variable de session con el resultado
      //y se devuelve el numero de resultados que en este caso siempre debe ser 1 si esta correcto
      //y es falso se devuelve el cero que sera para jusgar que realizar del lado Frond
      res.json(result);

    });
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });

});

// filtros
/* POST home page. */
router.post('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error
  var year = req.body.year; //aqui se saca el primer valor seleccionado
  var year2 = req.body.year2; //aqui se saca el segundo valor seleccionado

    
  var sql='select anio,cant_docentes_tc,cant_docentes_hc,relacion_docentes,"sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" from "Datawarehouse"."KPI_Relacion_Docentes" join manuales_indicadores on "manual_Rela"=codigo where anio BETWEEN $1 and $2 order by anio desc';
  //aquui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde serealiza el query de la DB
    //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,[year,year2],function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //console.log(result);
      res.json(result);

    });
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });



});

module.exports = router;
