

.PHONY: all copy lint fix pretty test


all: lint pretty test

copy:
	-mkdir -p dist/mathjax
	cp *.js dist/
	cp mathjax/*.js dist/mathjax/
	cp asciimath-based/*.js dist/

pretty: copy
	./node_modules/.bin/eslint --fix dist/*.js dist/**/*.js
	./node_modules/.bin/prettier --write dist/*.js dist/**/*.js
	./node_modules/.bin/eslint --fix dist/*.js dist/**/*.js

lint:
	./node_modules/.bin/eslint .

fix:
	./node_modules/.bin/eslint --fix .
	./node_modules/.bin/prettier --write *.js test/*.js mathjax/*.js
	./node_modules/.bin/eslint --fix .

