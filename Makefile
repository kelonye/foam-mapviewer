run: node_modules
	@yarn start

deploy:
	@git push || xargs echo
	@git push heroku master

server:
	@NODE_ENV=development node src/server.js

node_modules:
	@yarn

.PHONY: server deploy run
