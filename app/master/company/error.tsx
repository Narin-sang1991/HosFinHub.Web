"use client";

import React from "react";
import { ErrorMain } from '@/gulf.client.component/error.main';

type ErrorCompanyProps = { error: any }

const ErrorCompany = function ErrorCompany({ error }: ErrorCompanyProps) {
    return (
        <ErrorMain pageName={"Company"} error={error} />
    );
}

export default ErrorCompany;