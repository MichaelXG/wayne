import us from '../locales/us';
import pt from '../locales/pt';

const locales = { us, pt };

class GlobalI18n {
  constructor() {
    this.language = 'us'; // Default language
    // Automatically set language based on browser settings
    // this.language = navigator.language === 'en-US' ? 'us' : 'pt';
  }

  setLanguage(lang) {
    if (locales[lang]) {
      this.language = lang;
    } else {
      console.warn(`Language ${lang} not supported. Falling back to English.`);
      this.language = 'us';
    }
  }

  getLocale() {
    return locales[this.language] || locales.en;
  }

  t(path) {
    const keys = path.split('.');
    let result = this.getLocale();
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) {
        console.warn(`Missing translation for path: ${path}`);
        return path; // Fallback to path
      }
    }
    return result;
  }
}

const globalI18n = new GlobalI18n();

export default globalI18n;
