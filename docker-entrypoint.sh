#!/bin/bash
set -e

# Add kibana as command if needed
if [[ "$1" == -* ]]; then
	set -- kibana "$@"
fi

# Run as user "kibana" if the command is "kibana"
if [ "$1" = 'kibana' ]; then
	if [ "$ELASTICSEARCH_URL" ]; then
		sed -ri "s!^(\#\s*)?(elasticsearch\.url:).*!\2 '$ELASTICSEARCH_URL'!" /etc/kibana/kibana.yml
	fi

	if [ "$KIBANA_BASE_PATH" ]; then
		sed -ri "s!^(\#\s*)?(server\.basePath:).*!\2 '$KIBANA_BASE_PATH'!" /etc/kibana/kibana.yml
	fi

	if [ "$SIGNUP_APP" ]; then
		node ./signup-app.js
	fi

        if [ "$TILEMAP_MAX_ZOOM" ]; then
                echo "tilemap.options.maxZoom: $TILEMAP_MAX_ZOOM" >> /etc/kibana/kibana.yml
        fi

        if [ "$TILEMAP_URL" ]; then
                echo "tilemap.url: $TILEMAP_URL" >> /etc/kibana/kibana.yml
        fi

	set -- gosu kibana tini -- "$@"
fi


exec "$@"
