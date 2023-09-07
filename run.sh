#!/bin/bash
# shellcheck disable=SC2046

# Load environment variables
export $(egrep -v '^#' .env | xargs -d '\n')

bls function invoke --rebuild --serve \
  --env WEB3_RPC_ENDPOINT="$WEB3_RPC_ENDPOINT" \
  --env GUARDIAN_ADDRESS="$GUARDIAN_ADDRESS" \
  --env GUARDIAN_PUBLIC_KEY="$GUARDIAN_PUBLIC_KEY" \
  --env GUARDIAN_PRIVATE_KEY="$GUARDIAN_PRIVATE_KEY"