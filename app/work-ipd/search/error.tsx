"use client";

import React from "react";
import { ErrorMain } from '@/client.component/error.main';

type ErrorIpdSearchProps = { error: any }

const ErrorIpdSearch = function ErrorIpdSearch({ error }: ErrorIpdSearchProps) {
    return (
        <ErrorMain pageName={"IPD List"} error={error} />
    );
}

export default ErrorIpdSearch;