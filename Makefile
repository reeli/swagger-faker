dev:
	ts-node src/cli/index.ts gen
	ts-node src/cli/index.ts run

mock:
	npx json-server --watch mock-server/db.js --middlewares mock-server/middlewares/*.js

test:
	jest

build:
	rm -rf .output/
	tsc

release:
	rm -rf dist/
	rollup -c rollup.config.ts

release_doc:
	rm -rf docs
	typedoc
	ts-node scripts/doc.ts
