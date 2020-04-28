#/bin/bash

# 1. Debug docker run for tool installation
# docker run -it --rm detect-sensitive-artifacts:local sh

# 2. Debug tool instrumentation
# docker run -it --rm -v $(pwd)/test-src/:/opt/mount/ -v $(pwd):/opt/app detect-sensitive-artifacts:local /bin/sh

# 3. Full dry run
# docker run -it --rm -v $(pwd)/test-src/:/opt/mount/ -v $(pwd):/opt/app detect-sensitive-artifacts:local sh

# 4. local Production run
docker run -it --rm -v $(pwd)/test-src/:/opt/mount/ detect-sensitive-artifacts:local