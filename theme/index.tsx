"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { primaryColor } from "@/client.constant/styles..component.constant";

const withTheme = (node: JSX.Element) => (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primaryColor,
          },
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 16,
            },
          }}
        >
          {node}
        </ConfigProvider>
      </ConfigProvider>
    </>
  )

export default withTheme;