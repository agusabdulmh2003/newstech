// utils/translate.js
import axios from 'axios';

export const translateText = async (text) => {
    try {
        const response = await axios.post('https://api.example.com/translate', {
            text: text,
            targetLanguage: 'id' // Ganti dengan bahasa target yang diinginkan
        });
        return response.data.translatedText; // Sesuaikan dengan struktur respons API
    } catch (error) {
        console.error('Error translating text:', error);
        return text; // Kembalikan teks asli jika terjadi kesalahan
    }
};