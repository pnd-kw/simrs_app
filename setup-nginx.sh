#!/bin/bash

APP_NAME="fe-simrs"
DEPLOY_PATH="/home/it/Dev/fe-simrs"
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
NGINX_LINK="/etc/nginx/sites-enabled/$APP_NAME"
PORT_PUBLIC=7010
PORT_NEXT=3001

echo "🧹 Hapus konfigurasi nginx lama jika ada..."
sudo rm -f "$NGINX_CONF"
sudo rm -f "$NGINX_LINK"

echo "🔧 Setup nginx config di port $PORT_PUBLIC..."
cat <<EOF > "/tmp/$APP_NAME"
server {
    listen $PORT_PUBLIC;
    server_name _;

    root $DEPLOY_PATH/public;

    location / {
        proxy_pass http://localhost:$PORT_NEXT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
sudo mv "/tmp/$APP_NAME" "$NGINX_CONF"
sudo ln -sf "$NGINX_CONF" "$NGINX_LINK"
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Nginx listening on port $PORT_PUBLIC and proxying to port $PORT_NEXT"
