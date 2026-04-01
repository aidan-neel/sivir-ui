FROM oven/bun:1.3.11-debian

RUN apt-get update && apt-get install -y --no-install-recommends \
	git \
	openssh-client \
	ca-certificates \
	curl \
	unzip \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/silk
