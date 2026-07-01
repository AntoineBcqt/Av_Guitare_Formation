// Configuration injectée à la volée en production par le conteneur Docker.
// En local (développement), ce fichier est statique et n'écrase rien.
window.env = {
  VITE_API_URL: ""
};
