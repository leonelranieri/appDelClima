const urlTraductor = 'https://api.mymemory.translated.net';

export async function traducir(descrip) {
    try {
        if (descrip.toLowerCase() === 'smoke') {
            return 'humo';
        }
        const response = await fetch(`${urlTraductor}/get?q=${descrip}&langpair=en-GB|es-ES`);
        const json = await response.json();
        const traduccionOriginal = json.responseData.translatedText;
        const traduccionCorregida = traduccionOriginal.replace(/weather forecast|weather condition/gi, '')
                                                        .trim();
        return traduccionCorregida;
    } catch (error) {
        console.error('Error al traducir:', error);
        return descrip;  // En caso de error, devuelve la descripción original
    }
}
