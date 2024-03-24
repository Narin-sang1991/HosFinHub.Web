"use client";

import React from "react";
import { ErrorMain } from '@/gulf.client.component/error.main';

type ErrorOpdSearchProps = { error: any }

const ErrorOpdSearch = function ErrorOpdSearch({ error }: ErrorOpdSearchProps) {
    return (
        <ErrorMain pageName={"OPD List"} error={error} />
    );
}

export default ErrorOpdSearch;