"use client";

import React, { useEffect, useState } from "react";
import {   Space } from 'antd';
import withTheme from '../../../theme';


export type CategoryProps = {}

const Category = function Category(props: CategoryProps) {
    return (
        <Space direction="vertical" size={16}>
            CATEGORY PAGE
        </Space>
    );
}


const CategoryPage = () => {
    return withTheme(<Category />);
}
export default CategoryPage;

