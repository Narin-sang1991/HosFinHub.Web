import { Form, Input, InputNumber } from "antd";


export interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'selector';
    record: T;
    index: number;
    children: React.ReactNode;
    styleClass: any;
    selectorNode: any;
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
    selectorNode,
    ...restProps
}: EditableCellProps<T>) {

    const inputNode = getInputNode(inputType, selectorNode);

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

function getInputNode(inputType: string, selectorNode: any) {
    return inputType === 'number'
        ? <InputNumber />
        : inputType === 'selector'
            ? selectorNode
            : <Input />;
}
