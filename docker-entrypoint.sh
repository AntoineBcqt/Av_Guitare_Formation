#!/bin/sh
set -e

# Valeurs par défaut si non fournies dans l'environnement du conteneur
export PORT="${PORT:-8080}"
export BACKEND_URL="${BACKEND_URL:-http://localhost:3000}"
export VITE_API_URL="${VITE_API_URL:-/api}"

echo "Remplacement des variables dans la configuration Nginx..."
envsubst '$PORT $BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Génération de /usr/share/nginx/html/env.js avec les variables d'environnement..."
cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  VITE_API_URL: "${VITE_API_URL}"
};
EOF

echo "Démarrage de Nginx sur le port $PORT (backend: $BACKEND_URL, api: $VITE_API_URL)..."
exec nginx -g "daemon off;"
