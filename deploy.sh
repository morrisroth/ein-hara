#!/bin/bash
# Ein Hara — VPS Deploy Script
# Run on the VPS as: bash deploy.sh
set -e

REPO="https://github.com/morrisroth/ein-hara.git"
APP_DIR="/var/www/ein-hara"
APP_USER="morris"

echo "==> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

echo "==> Installing nginx..."
sudo apt-get install -y nginx

echo "==> Installing PM2..."
sudo npm install -g pm2

echo "==> Cloning / pulling repo..."
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR" && git pull
else
  sudo git clone "$REPO" "$APP_DIR"
  sudo chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
  cd "$APP_DIR"
fi

echo "==> Installing dependencies..."
cd "$APP_DIR"
npm install --production

echo "==> Creating data directory..."
mkdir -p "$APP_DIR/data"

echo "==> Writing .env..."
cat > "$APP_DIR/.env" << 'ENVEOF'
PORT=3000
ADMIN_EMAIL=moris.roth@gmail.com
ADMIN_PASSWORD=mr315598748
JWT_SECRET=ein-hara-jwt-2026-xK9mP3qR7vN2wL5
DB_PATH=/var/www/ein-hara/data/analytics.db
ENVEOF

echo "==> Setting up nginx..."
sudo cp "$APP_DIR/nginx.conf" /etc/nginx/sites-available/ein-hara
sudo ln -sf /etc/nginx/sites-available/ein-hara /etc/nginx/sites-enabled/ein-hara
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "==> Starting app with PM2..."
cd "$APP_DIR"
pm2 delete ein-hara 2>/dev/null || true
pm2 start server.js --name ein-hara
pm2 save
pm2 startup | tail -1 | sudo bash

echo ""
echo "✅ Deploy complete!"
echo "   Site: http://213.199.53.73"
echo "   Admin: http://213.199.53.73/admin"
echo "   Logs: pm2 logs ein-hara"
