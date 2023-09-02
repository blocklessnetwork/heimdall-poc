#!/bin/bash
# shellcheck disable=SC2046

# Load environment variables
export $(egrep -v '^#' .env | xargs -d '\n')

bls function invoke --rebuild --serve \
  --env WEB3_RPC_ENDPOINT="$WEB3_RPC_ENDPOINT"