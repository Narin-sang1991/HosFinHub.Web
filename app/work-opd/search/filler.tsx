"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectResult, fillterAsync } from "@/store/work-opd/workOpdSlice";
import { Button, Card, Input, Space } from "antd";
import { SearchProps } from "antd/es/input";
import React from "react";

const Fillter = () => {
  const dispatch = useAppDispatch();
  const searchResult = useAppSelector(selectResult);

  const findOnFillterHn: SearchProps['onSearch'] = (hn: string, _e, info) => {
    if (hn === '') {
      reloadData()
    } else {
      if (searchResult == undefined) return null;

      const setTable = searchResult.data.filter(item => {
        const index = item.hn.indexOf(hn);
        if (index <= -1) return null;

        return item;
      });

      dispatch(fillterAsync(setTable))
    }
  }

  const findOnFillterVn: SearchProps['onSearch'] = (vn: string, _e, info) => {
    if (vn === '') {
      reloadData()
    } else {
      if (searchResult == undefined) return null;

      const setTable = searchResult.data.filter(item => {
        const index = item.seq.indexOf(vn)
        if (index <= -1) return null;
        return item;
      });

      dispatch(fillterAsync(setTable))
    }
  }

  const reloadData = () => {
    dispatch(fillterAsync(searchResult))
  }
  return (
    <React.Fragment>
      <Card >
        <Space size="middle" direction="horizontal">
          <Input.Search onSearch={findOnFillterHn} placeholder="ค้นหาด้วยHN" />
          <Input.Search onSearch={findOnFillterVn} placeholder="ค้นหาด้วยVN" />
          <Button onClick={reloadData} type="primary">Reload</Button>
        </Space>
      </Card>
    </React.Fragment>
  )
}

export default Fillter