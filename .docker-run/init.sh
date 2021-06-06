docker run --restart=always --name locweb \
	-p 12021:12021 \
	-v $PWD/data:/app/data \
	-v $PWD/config.json:/app/config/config.json \
	-d locweb-music
