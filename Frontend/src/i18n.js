import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import vi from './locales/vi.json';

const resources = {
    vi: { translation: vi },
};

i18n
    .use(LanguageDetector) // Tự động phát hiện ngôn ngữ của trình duyệt
    .use(initReactI18next) // Khởi tạo với React
    .init({
        resources,
        fallbackLng: "vi", // Ngôn ngữ mặc định
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
