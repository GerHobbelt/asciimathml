

.PHONY: all copy lint fix pretty test


all: lint pretty test

copy:
	-mkdir -p dist/mathjax
	cp *.js dist/
	cp mathjax/*.js dist/mathjax/
	cp asciimath-based/*.js dist/

pretty: copy
	./node_modules/.bin/prettier-eslint --eslint-config-path=.eslintrc.js --config=.prettierrc.js --write dist/*.js dist/**/*.js

lint:
	./node_modules/.bin/eslint .

fix:
	./node_modules/.bin/eslint --fix .

