#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/restclient-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/restclient-editor-protocol@${1}" --registry $REGISTRY