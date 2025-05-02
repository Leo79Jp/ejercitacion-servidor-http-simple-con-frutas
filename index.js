const http = require('http');
const url = require('url');
const fs = require('fs');

// Cambiar esta función por la lectura del archivo de frutas con fs
function leerFrutas() { 
  const frutasData = [
    { id: 1, nombre: 'manzana', color: 'rojo' },
    { id: 2, nombre: 'banana', color: 'amarillo' },
    { id: 3, nombre: 'naranja', color: 'naranja' },
    { id: 4, nombre: 'uva', color: 'morado' },
    { id: 5, nombre: 'fresa', color: 'rojo' },
    { id: 6, nombre: 'manzana verde', color: 'verde' }
  ];
  console.log("Simulando lectura de frutas...");
  return frutasData;
}

let frutas = [];
fs.readFile('./frutas.json', (err, datos) =>{
  if (err){
    console.error('Error al leer el archivo JSON: ', err);
  }else{
    frutas = JSON.parse(datos)
  }
})


// Crear el servidor HTTP
const servidor = http.createServer((req, res) => {
  // Configurar el header de respuesta como JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Obtener la ruta de la URL
  const path = url.parse(req.url).pathname;
  
  // TODO: Implementar el manejo de las siguientes rutas:

  // 1. '/' - Mensaje de bienvenida
  if (path === '/'){
    res.writeHead(200, {'content-type' : 'application/json'})
    res.end('Ejercitacion con Archivo JSON de frutas!')

    // 2. '/frutas/all' - Devolver todas las frutas
  }else if (path ==='/frutas/all'){
    res.writeHead(200, {'content-type' : 'application/json'})
    res.end(JSON.stringify(frutas))

    // 3. '/frutas/id/123' - Devolver una fruta por su ID
  }else if (path.startsWith('/frutas/id/')){
    const partes = path.split('/')
    const i = partes[3]-1
    if (i >= 0 && i < frutas.length){
        const fruta = frutas[i]
        res.writeHead(200, {'content-type' : 'application/json'})
        res.end(JSON.stringify(fruta))
    }else{
        res.writeHead(404, {'content-type': 'application/json'})
        res.end(JSON.stringify({Error: 'Indice de frutas esta fuera de rango🧐'}))
    }

    // 4. '/frutas/nombre/manzana' - Buscar frutas por nombre (parcial)
}else if (path.startsWith('/frutas/nombre/')){
  const partes = path.split('/')
  const nombre = partes[3].toLocaleLowerCase()
  const result = frutas.filter(fruta => 
      fruta.nombre.toLocaleLowerCase().includes(nombre))
    // 5. '/frutas/existe/manzana' - Verificar si existe una fruta
      if (result){
        res.writeHead(200, {'content-type' : 'application/json'})
        res.end(JSON.stringify(result))
      }
    // 6. Cualquier otra ruta - Error 404
}else{
  res.writeHead(404, {'content-type': 'application/json'})
  res.end(JSON.stringify({Error: 'Ruta no encontrada😒'}))
}
  
  // Por ahora, devolvemos un 404 para todas las rutas
  // res.statusCode = 404;
  // res.end(JSON.stringify({ error: 'Ruta no encontrada!😒' }));
});

// Iniciar el servidor
const PUERTO = 3000;
servidor.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}/`);
  console.log(`Rutas disponibles:`);
  console.log(`- http://localhost:${PUERTO}/`);
  console.log(`- http://localhost:${PUERTO}/frutas/all`);
  console.log(`- http://localhost:${PUERTO}/frutas/id/:id`);
  console.log(`- http://localhost:${PUERTO}/frutas/nombre/:nombre`);
  console.log(`- http://localhost:${PUERTO}/frutas/existe/:nombre`);
});