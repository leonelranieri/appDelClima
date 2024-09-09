const url ='https://pixabay.com/api';
const apiKey = '45862242-417acf24e8fc30219b5c1fa58'; // Reemplaza con tu clave API de Pixabay

export async function generarImagen(estado, ciudad) {
  const searchQuery = `imagen de la ciudad ${ciudad} con clima ${estado}`;
  fetch(`${url}/?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&image_type=photo`)
  .then(response => response.json())
  .then(data => {
    // Aquí puedes procesar la información recibida
    if (data.hits && data.hits.length > 0) {
      const img = document.getElementById("climaImagen");
      img.src = data.hits[0].webformatURL;
    }
  })
  .catch(error => console.error('Error:', error));

}

