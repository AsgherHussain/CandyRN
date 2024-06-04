import i18n from "i18n-js";
import en from './constants/en.json'
import sp from './constants/sp.json'

i18n.fallbacks = true;
i18n.translations = {
  sp,
  en,
};

export default i18n;