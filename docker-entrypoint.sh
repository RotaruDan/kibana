#!/bin/bash
set -e

# Run as user "kibana" if the command is "kibana"
if [ "$1" = '/usr/local/bin/kibana-docker' ]; then
	if [ "$ELASTICSEARCH_URL" ]; then
		sed -ri "s!^(\#\s*)?(elasticsearch\.url:).*!\2 '$ELASTICSEARCH_URL'!" $HOME/config/kibana.yml
	fi

	if [ "$KIBANA_BASE_PATH" ]; then
		sed -ri "s!^(\#\s*)?(server\.basePath:).*!\2 '$KIBANA_BASE_PATH'!"  $HOME/config/kibana.yml
	fi

	if [ "$SIGNUP_APP" ]; then
		$HOME/node/bin/node ./signup-app.js
	fi

    if [ "$TILEMAP_MAX_ZOOM" ]; then
            echo "tilemap.options.maxZoom: $TILEMAP_MAX_ZOOM" >>  $HOME/config/kibana.yml
    fi

    if [ "$TILEMAP_URL" ]; then
            echo "tilemap.url: $TILEMAP_URL" >>  $HOME/config/kibana.yml
    fi

	exec "$@"
fi


exec "$@"
