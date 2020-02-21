run: node_modules
	@npm run start

deploy:
#	@git push || xargs echo
	@git push heroku master
#	@npm run build
#	@surge -d https://foam-mapviewer.surge.sh -p dist

server:
	@NODE_ENV=development node src/server.js

node_modules:
	@npm i

.PHONY: server deploy run
