#!/usr/bin/env bash
# wait-for-it.sh

set -e

host="$1"
shift
port="$1"
shift

timeout="${WAIT_TIMEOUT:-15}"
cmd="$@"

>&2 echo "Waiting for $host:$port..."
until timeout "$timeout" bash -c "cat < /dev/null > /dev/tcp/$host/$port"; do
  >&2 echo "Service $host:$port is unavailable - sleeping"
  sleep 1
done

>&2 echo "Service $host:$port is up - executing command"
exec $cmd