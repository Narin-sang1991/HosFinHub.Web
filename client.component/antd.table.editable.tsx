import { dateDisplayFormat, timeDisplayFormat } from "@/client.constant/format.constant";
import {
    Form, Input, InputNumber,
    DatePicker, TimePicker
} from "antd";


export interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    isRequired?: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'selector' | 'date' | 'time';
    record: T;
    index: number;
    children: React.ReactNode;
    styleClass: any;
    selectorNode: any;
}

export function EditableCell<T>({
    editing,
    isRequired,
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
                            required: isRequired,
                            message: `ต้องระบุ ${title}!`,
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

function onSelectDate(value : Date){
    console.log('onSelectDate=>',value);
}

function getInputNode(inputType: string, selectorNode: any) {
    return inputType === 'number'
        ? <InputNumber />
        : inputType === 'selector'
            ? selectorNode
            : inputType === 'date'
                ? <DatePicker format={dateDisplayFormat} onChange={onSelectDate} />
                : inputType === 'time'
                    ? <TimePicker showHour={true} showMinute={true} showSecond={false}
                        minuteStep={5} format={timeDisplayFormat} />
                    : <Input />;
}
