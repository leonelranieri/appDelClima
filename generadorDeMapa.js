const urlCoordenadas = 'https://nominatim.openstreetmap.org';
let mapa;

export async function obtenerCoordenadas(lugar) {
    const response = await fetch(`${urlCoordenadas}/search?q=${lugar}&format=json&limit=1`);
    const data = await response.json();
    return data[0] ? { lat: data[0].lat, lon: data[0].lon, name: data[0].display_name} : null;
}

// Leaflet: Usa las coordenadas para crear un mapa centrado en ese lugar y le añade un marcador.
export async function mostrarMapa(lugar) {
    const coordenadas = await obtenerCoordenadas(lugar);

    if (coordenadas) {
        if (!mapa) {  // Si el mapa no ha sido inicializado aún
            mapa = L.map('mapa').setView([coordenadas.lat, coordenadas.lon], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapa);
        } else {
            mapa.setView([coordenadas.lat, coordenadas.lon], 13);  // Actualiza la vista del mapa
        }

        // Limpia los marcadores existentes
        mapa.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapa.removeLayer(layer);
            }
        });

        // Añade un nuevo marcador
        L.marker([coordenadas.lat, coordenadas.lon]).addTo(mapa)
            .bindPopup(coordenadas.name)
            .openPopup();

    } else {
        alert('Lugar no encontrado');
    }
}
