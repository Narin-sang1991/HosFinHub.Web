"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { primaryColor } from "@/client.constant/styles..component.constant";

const withTheme = (node: JSX.Element) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'blue',
          borderRadius: 16
        },
      }}
    >
      {/* <ConfigProvider
        theme={{
          token: {
            : 16,
          },
        }}
      >
     
    </ConfigProvider> */}
      {node}
    </ConfigProvider>
  </>
)

export default withTheme;