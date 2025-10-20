#!/bin/bash

echo "Creating SQS queue..."
awslocal sqs create-queue --queue-name events

echo "SQS queue created successfully!"
