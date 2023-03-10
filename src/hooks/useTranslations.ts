import {useEffect, useState} from 'react';
import {withTranslation as withTranslationHOC} from 'react-i18next';
import STORAGE_KEYS from '../config/storageKeys';
import i18n, {LANGUAGES, resources} from '../lang/i18n';
import storage from '../utils/storage';

const DEFAULT_LANGUAGE = 'en';

export const withTranslation = withTranslationHOC;

const useTranslations = () => {
  const [loaded, setLoaded] = useState(i18n.isInitialized);
  const [selected, setSelected] = useState(i18n.language || DEFAULT_LANGUAGE);
  useEffect(() => {
    if (!loaded) {
      storage.getItem(STORAGE_KEYS.LANGUAGE).then((language: any) => {
        i18n
          .init({
            compatibilityJSON: 'v3',
            resources,
            lng: language || DEFAULT_LANGUAGE,
            fallbackLng: DEFAULT_LANGUAGE,
            interpolation: {
              escapeValue: false,
            },
          })
          .then(() => {
            setSelected(language || DEFAULT_LANGUAGE);
            setLoaded(true);
          });
      });
    }
  }, [loaded]);
  const changeLanguage = async (lng: any) => {
    await storage.setItem(STORAGE_KEYS.LANGUAGE, lng);
    setSelected(lng);
    i18n.changeLanguage(lng);
  };
  return {selected, loaded, languages: LANGUAGES, changeLanguage};
};

export default useTranslations;
