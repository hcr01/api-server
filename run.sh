#!/bin/sh

cd `dirname $0`

hash node > /dev/null 2>&1 || {
  echo "[start] Please install node.js." >&2
  exit 1
}
if [ -d "src/node_modules" ]; then
	echo "[start] node_modules exists.";
else
	hash npm > /dev/null 2>&1 || {
		echo "[start] Please install npm." >&2
		exit 1
	}
	echo "[start] We need to install dependencies using npm...";
	printf "[start] Do you want to install them know (y/n)? ";
	read yn;
	if [ ! "$yn" = "y" ]; then
		echo "[start] Abort.";
		exit 1;
	fi
	cd src/
	npm install
	cd ..
fi

echo "[start] Starting server...";
node src/server.js
