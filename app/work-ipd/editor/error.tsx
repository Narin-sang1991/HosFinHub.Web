"use client";

import React from "react";
import { ErrorMain } from '@/client.component/error.main';

type ErrorIpdEditorProps = { error: any }

const ErrorIpdEditor = function ErrorIpdEditor({ error }: ErrorIpdEditorProps) {
    return (
        <ErrorMain pageName={"OPD Editor"} error={error} />
    );
}

export default ErrorIpdEditor;