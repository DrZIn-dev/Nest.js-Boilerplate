#!/bin/bash
set -e
set -x
if [ "$RUN_MIGRATIONS" ]; then
  echo "RUNNING MIGRATIONS";
  npm run typeorm:migration:generate -- init || true
  npm run typeorm:migration:run
fi
echo "START SERVER";

if [ "$NODE_ENV" = "production" ]; then
  npm run start:prod
else 
  npm run start:dev
fi