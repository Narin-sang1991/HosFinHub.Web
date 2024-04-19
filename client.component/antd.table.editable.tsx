import { Form, Input, InputNumber } from "antd";


export interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: T;
    index: number;
    children: React.ReactNode;
    styleClass: any;
}

export function EditableCell<T>({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    styleClass,
    ...restProps
}: EditableCellProps<T>) {

    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : <p className={styleClass}>{children}</p>
            }
        </td>
    );
};