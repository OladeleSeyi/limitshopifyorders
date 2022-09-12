import React, { useState } from "react";
import { Heading, Page } from "@shopify/polaris";
import {
  ResourcePicker,
  useAppBridge,
  // useFeatureRequest,
} from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";

const Index = () => {
  const app = useAppBridge();
  const [picker, setPicker] = useState(false);
  // const cartFeat = useFeatureRequest("Cart", "Fetch");

  const addLimitForProduct = async (
    product: any,
    url: string,
    token: string
  ) => {
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: JSON.stringify({
          productId: product.id,
          limit: 3, //make dynamic
          shop: product.vendor,
        }),
      });
    } catch (e) {
      throw e;
    }
  };

  const handleSelection = async (resources: any) => {
    setPicker(false);
    console.log(resources);
    const token = await getSessionToken(app);
    resources.selection.map(async (item: any) => {
      await addLimitForProduct(item, app.localOrigin, token);
    });
  };

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
      {/* <MyContext.Consumer> */}
      {/* {(value) => <DummyComp value={value} />} */}

      <ResourcePicker
        resourceType="Product"
        open={picker}
        onCancel={() => setPicker(false)}
        onSelection={(resources) => {
          handleSelection(resources);
        }}
      />
      {/* </MyContext.Consumer> */}
    </Page>
  );
};

export default Index;
