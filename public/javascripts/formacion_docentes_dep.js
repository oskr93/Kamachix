$(document).ready(function(){

  Load_first_time();
  Load_yearfirst_time();


  function aleatorio(inferior,superior){
    numPosibilidades = superior - inferior
    aleat = Math.random() * numPosibilidades
    aleat = Math.floor(aleat)
    return parseInt(inferior) + aleat
  }

  var colo2=[];
  var colo3=[];
  for(j=0;j<4;j++){
    var hexadecimal = new Array("3","4","5","6","7","8","9","A","B","C","D","E","F")
    var color_aleatorio2="";
    for (i=0;i<2;i++){
      var posarray = aleatorio(0,hexadecimal.length)
      color_aleatorio2 += hexadecimal[posarray]
    }
    colo2.push(color_aleatorio2)
  }
  var nuevoc="";
  for (i=0;i<colo2.length;i++){
    nuevoc = "#00" + colo2[i] + "00";
    colo3.push(nuevoc);
  }

  // funcion para cargar los datos por primera vez
  function Load_first_time(){
    $.ajax({
     type: "GET", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     dataType : 'json',
     data:{c:3},//Primera consulta
     //se ejecutasi todo se realiza bien
     success : function(json) {
       $("#txtjson").val(JSON.stringify(json));
       $("#datBody").html('');
       var r="";//variable para llenar los datos y el html e cada una de las filas
       var conta=json.rowCount;
       //ciclo para llenar los datos en las filas en r
       for(var i = conta-4 ; i<conta; i++){
         r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].nom_formacion+
         "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";
       }

       tittle="Nivel de formación de docentes tiempo completo <br> año: "+json.rows[conta-3].anio+"  Periodo: "+json.rows[conta-3].periodo+"<br>  Departamento de  "+json.rows[conta-3].name;
       $("#datBody").append(r);
       $("#titulo").append(tittle);

       var arra=[];

       for(var i =conta-4; i<conta;i++){
         var programa = {
           "nivel": json.rows[i].nom_formacion,
           "cantidad": json.rows[i].t_completo,
           "color": colo3[i]
         }
         arra.push(programa);

       }


       //cambio de graficas de barras
        $("#graph1").change(function () {
          if($(this).val() === '1'){
            columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
          }
          else if($(this).val() === '2'){
            columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
          }
          else if($(this).val() === '3'){
            lineGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
          }
          else if($(this).val() === '4'){
            areaGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
          }
          else if($(this).val() === '5'){
            barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
          }
          else if($(this).val() === '6'){
            barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
          }
        });

       //
       columnGraph(arra, "divgraph1", "Docentes tiempo completo", "nivel", "cantidad",0,0);
        // Cambio de graficas de pastel
      $("#graph10").change(function () {
        if($(this).val() === '1'){
           pieGraph(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
        }
        else if ($(this).val() === '2'){
           pieGraph3D(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
        }
      });
      //grafica de pastel por defecto
       pieGraph(arra, "divgraph2", "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");

      var totalTC=0;
      for(l=0;l<json.rowCount;l++){
        totalTC +=json.rows[l].t_completo ;
      }

       //grafica de acelerometro simple: total profesores tiempo completo
       simpleGauge(totalTC, divgraph3, "Profesores Tiempo completo");


     }
  });
 }

  function Load_yearfirst_time(){
    $.ajax({
     type: "GET", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     dataType : 'json',
     data:{c:4},//Primera consulta
     //se ejecutasi todo se realiza bien
     success : function(json) {
       //llenado de lista de departamentos
       var r2="";
       for(var j = 0 ; j<json.rowCount; j++){
         r2 = r2+"<option value='"+json.rows[j].name+"'>"+ json.rows[j].name+"</option> ";
       }
       $("#lst_dep").append(r2);


      }
   });

  //ajax para llenar la lista de años
  $.ajax({
     type: "GET", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     dataType : 'json',
     data:{c:5},//Primera consulta
     //se ejecutasi todo se realiza bien
     success : function(json) {

       // llenado de lista de años
        var r3="";
       for(var i = 0 ; i<json.rowCount; i++){
         r3 = r3+"<option value='"+json.rows[i].anio+"'>"+ json.rows[i].anio+"</option> ";
       }
       $("#lst_anio").append(r3);


      }
   });

   //ajax para llenar la lista de periodos
  $.ajax({
     type: "GET", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     dataType : 'json',
     data:{c:6},//Primera consulta
     //se ejecutasi todo se realiza bien
     success : function(json) {

       // llenado de lista de años
        var r4="";
       for(var k = 0 ; k<json.rowCount; k++){
         r4 = r4+"<option value='"+json.rows[k].periodo+"'>"+ json.rows[k].periodo+"</option> ";
       }
       $("#lst_per").append(r4);


      }
   });
  }

  // ajax para consulta de formacion docente por año

  $('#frmDepartamento').submit(function(event) {
    //se coloca los datos del form en el formato adecuado para enviar al server

    var formData = {
          //aqui se encriptan en MD5 antes de enviar
          'anio': $('#lst_anio').val(),
          'c':7,
          'name':$("#lst_dep").val(),
          'periodo':$("#lst_per").val()
        };
    //el metodo ajax para consulta asyncronica
    $.ajax({
     type: "POST", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     data: formData, //los datos que seran enviados al server
     dataType : 'json', //el formato de datos enviados y devueltos del server
     //se ejecutasi todo se realiza bien
     success : function(json) {
       $("#datBody").html('');
       $("#titulo").html('');
       var r="";//variable para llenar los datos y el html e cada una de las filas
       var tittle="";
       var conta=json.rowCount;
       // condicion para verificar que los datos de todos los niveles de formacion del año seleccionado esten en la BD
       if(conta == 4){
         //ciclo para llenar los datos en las filas en r
          for(var i = conta-4 ; i<conta; i++){
            r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].nom_formacion+
            "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";
          }

          tittle="Nivel de formación de docentes tiempo completo <br> año: "+json.rows[conta-3].anio+"  Periodo: "+json.rows[conta-3].periodo+"<br>  Departamento de  "+json.rows[conta-3].name;
          $("#datBody").append(r);
          $("#titulo").append(tittle);

          var arra=[];

          for(var i =0; i<4;i++){
            var programa = {
              "nivel": json.rows[i].nom_formacion,
              "cantidad": json.rows[i].t_completo,
              "color": colo3[i]
            }
            arra.push(programa);

          }


          //cambio de graficas de barras
            $("#graph1").change(function () {
              if($(this).val() === '1'){
                columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
              }
              else if($(this).val() === '2'){
                columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
              }
              else if($(this).val() === '3'){
                lineGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
              }
              else if($(this).val() === '4'){
                areaGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
              }
              else if($(this).val() === '5'){
                barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
              }
              else if($(this).val() === '6'){
                barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
              }
              else if($(this).val() === '7'){
                pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
              }
              else if($(this).val() === '8'){
                pieGraph3D(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
              }
            });

          //
          columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
          // Cambio de graficas de pastel
          $("#graph2").change(function () {
            if($(this).val() === '1'){
              columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
            }
            else if($(this).val() === '2'){
              columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
            }
            else if($(this).val() === '3'){
              lineGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
            }
            else if($(this).val() === '4'){
              areaGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
            }
            else if($(this).val() === '5'){
              barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
            }
            else if($(this).val() === '6'){
              barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
            }
            else if($(this).val() === '7'){
              pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
            }
            else if($(this).val() === '8'){
              pieGraph3D(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
            }
          });
          //grafica de pastel por defecto
          pieGraph(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");

          //ciclo para calcular el total de profesores tiempo completo
          var totalTC=0;
          for(l=0;l<json.rowCount;l++){
            totalTC +=json.rows[l].t_completo ;
          }

          //grafica de acelerometro simple: total profesores tiempo completo
          simpleGauge(totalTC, divgraph3, "Profesores tiempo completo");

       }
       else{
         alert('el año seleccionado no tiene suficientes datos. Por favor llene todos los datos de formacion docentes correspondientes a este año ');
          $("#lst_anio").html('');
          $("#lst_dep").html('');
          $("#lst_per").html('');
         Load_first_time();
         Load_yearfirst_time();
       }



     }
   });
   closedivfilter();
  event.preventDefault()
  });

  $("#btnfil").click(function (){
        opendivfilter();
  });

  //funciones para el modal

  function opendivfilter(){
    $("#divfilter").modal('show');
  }

  function closedivfilter(){
    $("#divfilter").modal('hide');
  }

  function hidenmodal(){
      $("#myModal").modal('hide');
      $("#divfilter").modal('show');
  }
});
