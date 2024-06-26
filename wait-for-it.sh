#!/usr/bin/env bash
set -e

host="$1"
port="$2"
shift 2
cmd="$@"

timeout="${WAIT_TIMEOUT:-15}"

echo "Waiting for $host:$port..."
until nc -z "$host" "$port"; do
  echo "Service $host:$port is unavailable - sleeping"
  sleep 1
done

echo "Service $host:$port is up - executing command"
exec $cmd
