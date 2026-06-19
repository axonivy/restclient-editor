package com.axonivy.connectivity.rest.client.connect;

import jakarta.ws.rs.core.Feature;
import jakarta.ws.rs.core.FeatureContext;

public class MyFeature implements Feature {

  @Override
  public boolean configure(FeatureContext context) {
    return true;
  }

}
