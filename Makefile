SHELL=/bin/bash

.PHONY: act
act:
	act -j ${JOB} -W .github/workflows/local.yml -P ubuntu-latest=node:22
