"use client";

import React from "react";
import { ConfigProvider, theme } from "antd";
import thTh from 'antd/locale/th_TH'

import 'dayjs/locale/th'
import dayjs from 'dayjs';


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
        }
      }}
    >
      {node}
    </ConfigProvider>
  </>
)

export default withTheme;