"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { primaryColor } from "@/client.constant/styles..component.constant";
import thTh from 'antd/locale/th_TH'
import dayjs from 'dayjs';
import 'dayjs/locale/th'

import 'moment/locale/th'
import moment from "moment";
moment.locale('th')
dayjs.locale('th')

const withTheme = (node: JSX.Element) => (
  <>
    <ConfigProvider
      locale={thTh}
      theme={{
        token: {

          "borderRadius": 16,
          "colorPrimary": "#13c2c2",
          "colorInfo": "#13c2c2",
          "colorSuccess": "#52c41a",
          "colorWarning": "#fadb14",
          "colorLink": "#13c29c"

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