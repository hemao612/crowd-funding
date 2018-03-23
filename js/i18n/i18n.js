import I18n from 'i18n-js';
import en from './locales/en';
import zh from './locales/zh-CN';
import Expo from 'expo';

/*
 *  Returns the current device locale.
 */
I18n.initAsync = async () => {
  const locale = await Expo.Util.getCurrentLocaleAsync();
  I18n.locale = (locale) ? locale.replace(/_/, '-') : '';
};

I18n.fallbacks = true;

I18n.translations = {
  en,
  zh,
};

export default I18n;
