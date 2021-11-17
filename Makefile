RUN_DB:
	docker-compose --env-file .env.docker --file compose.yaml up -d --quiet-pull --remove-orphans mongodb_primary mongodb_secondary mongodb_arbiter

STOP_APP:
	docker-compose --env-file .env.docker --file compose.yaml down