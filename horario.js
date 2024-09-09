const url_base = 'https://api.timezonedb.com/v2.1';
const api_key = 'TFAO17ACOQYQ';
const url_extend = `get-time-zone?key=${api_key}&format=json&by=position`;

export async function obtenerHoraActual(lat, lon) {
    try {
        const response = await fetch(`${url_base}/${url_extend}&lat=${lat}&lng=${lon}`);
        const data = await response.json();
        if (data.status === 'OK') {
            let dayAndhour = data.formatted;
            let hour = dayAndhour.slice(11);             
            return hour;
        } else {
            throw new Error('Error al obtener la hora: ', data.message);
        }   
    } catch (error) {
        console.log(error);
    }
}