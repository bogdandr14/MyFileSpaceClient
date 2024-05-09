export const environment = {
  production: true,
  baseApiUrl: 'https://myfilespaceapi.azurewebsites.net/',
  defaultLanguage: 'en',
  appSettings: {
    version: '',
    languages: [
      { translationKey: "languageEN", iso: "en-US", languageKey: "en" },
      { translationKey: "languageRO", iso: "ro-RO", languageKey: "ro" }],
  },
};
