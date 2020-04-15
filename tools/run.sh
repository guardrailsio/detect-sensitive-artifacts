#/bin/bash

# 1. Debug docker run for tool installation
# docker run -it --rm custom-engine-name:local /bin/sh

# 2. Debug tool instrumentation
# docker run -it --rm -v $(pwd)/test-src/:/opt/mount/ -v $(pwd):/opt/app custom-engine-name:local /bin/sh

# 3. Full dry run
# docker run -it --rm -v $(pwd)/test-src/:/opt/mount/ -v $(pwd):/opt/app custom-engine-name:local sh

# 4. local Production run
docker run -it --rm -v $(pwd)/test-src/:/opt/mount/ custom-engine-name:local