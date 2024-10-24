#!/bin/bash

# package.jsonのversionを取得
PACKAGE_VERSION=$(grep '"version":' package.json | cut -d '"' -f 4)

# そのバージョンをapp.jsonに反映
# macOSの場合は -i ''、Linuxの場合は -i
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' 's/"version": "[^"]*"/"version": "'"$PACKAGE_VERSION"'"/' app.json
else
  sed -i 's/"version": "[^"]*"/"version": "'"$PACKAGE_VERSION"'"/' app.json
fi

echo "Synced version to app.json: $PACKAGE_VERSION"
