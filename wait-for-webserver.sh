#!/bin/sh
set -eu

# A running container does not mean Spring Boot has finished starting.
until curl --fail --silent --show-error --connect-timeout 2 --max-time 5 http://localhost:8080/ > /dev/null; do
  >&2 echo "Web service is unavailable - sleeping"
  sleep 1
done

>&2 echo "Webservice is up - continuing"
