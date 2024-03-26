
import * as React from 'react';
import { Button, Card, Form, DatePicker, } from 'antd';
import withTheme from '../../../theme';

type OpdEditorProps = {}

const OpdEditor = function OpdEditor(props: OpdEditorProps) {

    const dispatch = useAppDispatch();
    const [formEditor] = Form.useForm();



    return (
        <div>

        </div>
    );
}

const OpdEditorPage = () => {
    return withTheme(<OpdEditor />);
}
export default OpdEditorPage;

