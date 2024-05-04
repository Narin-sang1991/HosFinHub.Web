"use client";

import React from "react";
import { ErrorMain } from '@/client.component/error.main';

type ErrorOpdEditorProps = { error: any }

const ErrorOpdEditor = function ErrorOpdEditor({ error }: ErrorOpdEditorProps) {
    return (
        <ErrorMain pageName={"OPD Editor"} error={error} />
    );
}

export default ErrorOpdEditor;