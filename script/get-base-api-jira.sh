#!/bin/bash

JIRA_ID=$(echo "$1" | tr '[:lower:]' '[:upper:]')
JIRA_USER=$2
JIRA_API_TOKEN=$3

GET_CUSTOMFIELD_FROM_JIRA=$(curl "https://otoklix.atlassian.net/rest/api/3/issue/$JIRA_ID?fields=customfield_10039" -k --silent --user $JIRA_USER:$JIRA_API_TOKEN)
GET_PREVIEW_URL=$(echo $GET_CUSTOMFIELD_FROM_JIRA | jq -r '.fields.customfield_10039')

if [ $GET_PREVIEW_URL == null ]
then
  echo "https://api.stg.otoklix.com/"
else
  echo $GET_PREVIEW_URL
fi