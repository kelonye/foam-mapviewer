run: node_modules
	@npm run start

deploy:
	@git push || xargs echo
	@git push heroku master

server:
	@NODE_ENV=development node src/server.js

node_modules:
	@npm i

.PHONY: server deploy run
