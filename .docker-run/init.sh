docker run --restart=always --name locweb \
	-p 12021:12021 \
	-v $PWD/data:/dist/data \
	-v $PWD/config.json:/dist/config/config.json \
	-d locweb-music
