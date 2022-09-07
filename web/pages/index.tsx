import React, { useState, useEffect } from "react";
import { Heading, Page, Button } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import createApp from "@shopify/app-bridge";
import { Cart } from "@shopify/app-bridge/actions";
import getConfig from "next/config";
import { Context } from "@shopify/app-bridge-react";

const Index = (props) => {
  let contextType = Context;
  const [picker, setPicker] = useState(false);
  const { publicRuntimeConfig } = getConfig();

  const app = createApp({
    apiKey: publicRuntimeConfig.API_KEY,
    host: "dHNoZXJvLm15c2hvcGlmeS5jb20vYWRtaW4",
  });

  let cart = Cart.create(app);

  const handleSelection = (resources) => {
    setPicker(false);
    console.log(resources);
    console.log(cart);

    let lineItemPayload = resources.selection.map((product) => product.id);

    console.log("stuff", contextType);

    cart.dispatch(Cart.Action.ADD_LINE_ITEM, {
      data: lineItemPayload,
    });
  };

  app.error(function (data: Error.ErrorAction) {
    console.info("[client] Error received: ", data);
  });

  // var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload) {
  //   console.log("[Client] fetchCart", payload);
  //   unsubscriber();
  // });

  useEffect(() => {
    cart.subscribe(Cart.Action.UPDATE, function (payload) {
      console.log("[Client] cart update", payload);
    });
  }, [cart]);

  return (
    <Page
      title="Product Selector"
      primaryAction={{
        content: "Select Products to Cart",
        onAction: () => setPicker(true),
      }}
    >
      <Heading>
        Shopify APP with mongodb & typescript <span role={"img"}>🎉</span>
      </Heading>
      <ResourcePicker
        resourceType="Product"
        open={picker}
        onCancel={() => setPicker(false)}
        onSelection={(resources) => {
          handleSelection(resources);
        }}
      />
    </Page>
  );
};
export default Index;
