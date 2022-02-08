dev:
	pnpx ts-node src/cli/index.ts gen
	pnpx ts-node src/cli/index.ts run

mock:
	pnpx json-server --watch mock-server/db.js --middlewares mock-server/middlewares/*.js

test:
	pnpx jest

release:
	rm -rf dist/
	pnpx tsc
	pnpx rollup -c rollup.config.ts

release_doc:
	rm -rf docs
	pnpx typedoc
	pnpx ts-node scripts/doc.ts
