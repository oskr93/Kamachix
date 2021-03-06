//function que comprueba del lado cliente las extensiones de los archivos
function comprueba_extension(archivo) {
   var extensiones_permitidas = new Array(".csv");
   if (!archivo) {
      //Si no tengo archivo, es que no se ha seleccionado un archivo en el formulario
      return 0;
   }else{
      //recupero la extensión de este nombre de archivo
      var extension = (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
      //compruebo si la extensión está entre las permitidas
      var permitida = false;
      for (var i = 0; i < extensiones_permitidas.length; i++) {
         if (extensiones_permitidas[i] == extension) {
         permitida = true;
         break;
         }
      }
      if (!permitida) {
        return 1
      }else{
        return 2;
      }
   }
}

//function para cargar los archivos con ayas a la que le enviamos la url del
// router que tratara cada archivo
function loadfile(url, name){
  $('#mesage span').removeClass('glyphicon glyphicon-alert')
  var formData = new FormData();
  formData.append('file', $('#'+name)[0].files[0]);
  $.ajax({
     url : url,
     type : 'POST',
     data : formData,
     processData: false,  // tell jQuery not to process the data
     contentType: false,  // tell jQuery not to set contentType
     success : function(data) {
       // alert(JSON.stringify(data));
       if(data.upload==='0') {
         $('#mesage span').addClass('glyphicon glyphicon-alert')
         $('#mesage p').html('Seleccione un archivo!!');
       }
       else if(data.upload==='1'){
         $('#mesage span').addClass('glyphicon glyphicon-alert')
         $('#mesage p').html('Formato de archivo no valido!!');
       }
       else if(data.upload==='2'){
         $('#mesage span').addClass('glyphicon glyphicon-alert')
         $('#mesage p').html('Error!!');
       }
       else {
         if(data.count!='0'){
           $('#mesage span').removeClass('red');
           $('#mesage span').addClass('green');
           $('#mesage p').removeClass('red');
           $('#mesage p').addClass('green');
           $('#mesage span').removeClass('glyphicon glyphicon-alert')
           $('#mesage span').removeClass('glyphicon glyphicon-remove')
           $('#mesage span').addClass('glyphicon glyphicon-ok')
           $('#mesage p').html('Carga Exitosa!!');
         }else{
           $('#mesage span').addClass('glyphicon glyphicon-remove')
           $('#mesage p').html('Error Cargar Datos!!');
         }
       }
     }
  });
}
