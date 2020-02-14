run: node_modules
	@NODE_ENV=development npm run start

deploy:
	@git push || xargs echo
	@git push heroku master

server:
	@node src/server.js

node_modules:
	@npm i

.PHONY: server deploy run
