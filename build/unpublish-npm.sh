#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/restclient-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/restclient-editor-protocol@${1}" --registry $REGISTRY