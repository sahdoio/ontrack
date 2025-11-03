#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

while true; do
  clear
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║         OnTrack - SQS Job Monitor Dashboard               ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  
  # Queue Stats
  echo -e "${YELLOW}📊 Queue Statistics:${NC}"
  ATTRS=$(docker exec ontrack-localstack awslocal sqs get-queue-attributes \
    --queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/events \
    --attribute-names All 2>/dev/null | python3 -c "import sys, json; attrs=json.load(sys.stdin)['Attributes']; print(f\"  Messages in Queue: {attrs['ApproximateNumberOfMessages']}\n  In Flight: {attrs['ApproximateNumberOfMessagesNotVisible']}\n  Delayed: {attrs['ApproximateNumberOfMessagesDelayed']}\")" 2>/dev/null)
  echo "$ATTRS"
  echo ""
  
  # Recent Events Published
  echo -e "${YELLOW}📤 Recent Events Published (Last 10):${NC}"
  docker logs ontrack-backend --tail 100 2>&1 | \
    grep "Event published to SQS" | \
    tail -10 | \
    sed 's/\[3[0-9]m//g' | \
    sed 's/\[39m//g' | \
    awk '{print "  " $0}'
  echo ""
  
  # Recent Events Processed
  echo -e "${YELLOW}📥 Recent Events Processed (Last 10):${NC}"
  docker logs ontrack-backend --tail 100 2>&1 | \
    grep "Processing message with event" | \
    tail -10 | \
    sed 's/\[3[0-9]m//g' | \
    sed 's/\[39m//g' | \
    awk '{print "  " $0}'
  echo ""
  
  # Errors
  echo -e "${YELLOW}❌ Recent Errors:${NC}"
  ERRORS=$(docker logs ontrack-backend --tail 50 2>&1 | grep -i "error\|failed" | tail -5)
  if [ -z "$ERRORS" ]; then
    echo -e "  ${GREEN}✓ No recent errors${NC}"
  else
    echo "$ERRORS" | sed 's/\[3[0-9]m//g' | sed 's/\[39m//g' | awk '{print "  " $0}'
  fi
  echo ""
  
  # Handler Status
  echo -e "${YELLOW}🔧 Registered Handlers:${NC}"
  docker logs ontrack-backend --tail 500 2>&1 | \
    grep "Registered event handler" | \
    tail -10 | \
    sed 's/\[3[0-9]m//g' | \
    sed 's/\[39m//g' | \
    awk '{print "  " $0}'
  echo ""
  
  echo -e "${BLUE}Press Ctrl+C to exit | Refreshing in 5 seconds...${NC}"
  sleep 5
done
