
"use client";

//#region Import
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Typography, Table, Form, Space, Popconfirm, Tooltip, Tag, Row, Col, Input, InputNumber, Select, DatePicker, } from "antd";
import type { TableProps, TableColumnProps } from "antd";
import { EditTwoTone, CheckOutlined, CloseOutlined, DeleteOutlined, FileAddOutlined, } from "@ant-design/icons";
import { AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";
import { EditableCell } from "@/client.component/antd.table.editable";
import { FeeDrugSelector } from "@/app/catalogs/selector.fee.drug";
import { FeeScheduleSelector } from "@/app/catalogs/selector.fee.schedule";
import { AdditPaymentTypeSelector } from "@/app/catalogs/selector.adp.type";
import { isNumber } from "@/client.constant/format.constant";
import { FeeDrugSelectorModel } from "@/store/fee-additional/feeDrugModel";
import { FeeScheduleSelectorModel } from "@/store/fee-additional/feeScheduleModel";
import { OpdDetailModel } from "@/store/work-opd/opdEditorModel";
import { adpTypeInstrument, adpTypeFreeSchedule } from "@/client.constant/invoice.additional.constant";
import { adpOptionalObj, getAdpDisplay } from "@/client.constant/invoice.addit.payment.constant";
//#endregion

type InvoiceAdditionalProps = {
  opdData?: OpdDetailModel,
  additionalItems?: AdditPaymentModelEditorModel[],
  onChange?: any,
};

const { Text } = Typography;

const InvoiceAdditionalPage = function InvoiceAdditional({ opdData, additionalItems = [], onChange }: InvoiceAdditionalProps) {

  const [formAdpEditor] = Form.useForm();
  const [formAdpAdding] = Form.useForm();
  const [editingAdditionalData, setEditingData] = useState<AdditPaymentModelEditorModel[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const defaultFeeDrug = { id: "", code: "", unitPrice: "" };
  const [feeDrugSelected, setDrugSelected] = useState<FeeDrugSelectorModel>(defaultFeeDrug);
  const defaultFeeSchedule = { item_code: "", item_name: "" };
  const [feeScheduleSelected, setScheduleSelected] = useState<FeeScheduleSelectorModel>(defaultFeeSchedule);
  const adding = useRef(false);

  useEffect(() => {
    // console.log('invoice.additional', additionalItems);
    setEditingData(additionalItems);
  }, [additionalItems]);

  const triggerChange = (additionalData: AdditPaymentModelEditorModel[]) => {
    // console.log('additionalData', additionalData)
    onChange?.({ adpItems: additionalData });
  };

  //#region Editor
  const cancel = () => {
    setEditingKey("");
  };

  const viewMode = editingKey === "";
  const isEditing = (record: AdditPaymentModelEditorModel) => record.id === editingKey;
  function editItem(record: Partial<AdditPaymentModelEditorModel>): void {
    formAdpEditor.setFieldsValue({ ...record });
    setEditingKey(record?.id || "");
  };

  function deleteItem(key: React.Key): void {
    const newData = [...editingAdditionalData];
    const index = newData.findIndex((item) => key === item.id);
    if (index > -1) {
      newData.splice(index, 1);
      setEditingData(newData);
      triggerChange(newData);
    }
  };

  async function saveItem(key: React.Key): Promise<void> {
    try {
      const row = (await formAdpEditor.validateFields()) as AdditPaymentModelEditorModel;
      const newData = [...editingAdditionalData];
      const index = newData.findIndex((item) => key === item.id);
      let hasCode: boolean = (row.code != '');
      if (index > -1) {
        const item = newData[index];
        if (item.isFeeDrug) {
          let rowFeeDrug = row.feeEditor as FeeDrugSelectorModel;
          row.feeDrug = { ...rowFeeDrug };
          if ((rowFeeDrug.code).length > 0) row.code = rowFeeDrug.code || row.code;
          if (isNumber(Number(rowFeeDrug.unitPrice))) {
            let unitPrice = Number(rowFeeDrug.unitPrice) == 0 ? Number(row.rate) : Number(rowFeeDrug.unitPrice);
            let totalreq = unitPrice * Number(row.qty);
            row.rate = unitPrice
            row.total = totalreq;
          } else {
            row.total = Number(row.rate) * Number(row.qty);
          }
        } else {
          let rowFeeSchedule = row.feeEditor as FeeScheduleSelectorModel;
          row.feeSchedule = { ...rowFeeSchedule };
          if ((rowFeeSchedule.item_code).length > 0) row.code = rowFeeSchedule.item_code || row.code;
          if (isNumber(Number(rowFeeSchedule.price))) {
            let unitPrice = Number(rowFeeSchedule.price) == 0 ? Number(row.rate) : Number(rowFeeSchedule.price);
            let totalreq = unitPrice * Number(row.qty);
            row.rate = unitPrice
            row.total = totalreq;
          } else {
            row.total = Number(row.rate) * Number(row.qty);
          }
        }

        if (item.type == row.typeEditor.id) {
          item.type = row.typeEditor.id;
          item.typeDisplay = row.typeEditor.text;
        }

        newData.splice(index, 1, {
          ...item,
          ...row,
          hasError: !hasCode
        });
        setEditingData(newData);
        setEditingKey("");
      } else {
        newData.push({ ...row, hasError: !hasCode });
        setEditingData(newData);
        setEditingKey("");
      }

      triggerChange(newData);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  //#endregion

  //#region Adding
  const addItemFeeDrug = () => {
    const additionalData = [...editingAdditionalData];
    let newId = uuidv4();
    if (feeDrugSelected.code != "" && feeDrugSelected.code != undefined) {
      let unitPrice = isNumber(Number(feeDrugSelected.unitPrice)) ? Number(feeDrugSelected.unitPrice) : 0;
      let qty = 1;
      let typeText = getAdpDisplay(adpTypeInstrument);
      const newData: AdditPaymentModelEditorModel = {
        dummyKey: (additionalData?.length || 0) + 1,
        isDurty: false,
        hasError: false,
        id: newId,
        seq: opdData?.seq || "",
        hn: opdData?.hn || "",
        dateopd: opdData?.dateopd || new Date,
        type: adpTypeInstrument,
        typeDisplay: typeText,
        typeEditor: { id: adpTypeInstrument, text: typeText },
        code: feeDrugSelected.code,
        feeDrug: { ...feeDrugSelected },
        feeEditor: { ...feeDrugSelected },
        isFeeDrug: true,
        qty: qty,
        rate: unitPrice,
        dose: feeDrugSelected.strength,
        total: Number(unitPrice) * Number(qty),
        totcopay: 0,
        clinic: opdData?.clinic || "",
        itemsrc: 2,
      }
      additionalData.push(newData);
      setEditingData(additionalData);
      triggerChange(additionalData);
    }
  };

  const addItemFeeSchedule = () => {
    const additionalData = [...editingAdditionalData];
    let newId = uuidv4();
    if (feeScheduleSelected.item_code != "" && feeScheduleSelected.item_code != undefined) {
      let unitPrice = isNumber(Number(feeScheduleSelected.price)) ? Number(feeScheduleSelected.price) : 0;
      let qty = 1;
      let typeSelected = feeScheduleSelected.type || adpTypeFreeSchedule;
      let typeText = getAdpDisplay(typeSelected);
      const newData: AdditPaymentModelEditorModel = {
        dummyKey: (additionalData?.length || 0) + 1,
        isDurty: false,
        hasError: false,
        id: newId,
        seq: opdData?.seq || "",
        hn: opdData?.hn || "",
        dateopd: opdData?.dateopd || new Date,
        type: typeSelected,
        typeDisplay: typeText,
        typeEditor: { id: typeSelected, text: typeText },
        code: feeScheduleSelected.item_code,
        feeSchedule: { ...feeScheduleSelected },
        feeEditor: { ...feeScheduleSelected },
        isFeeDrug: false,
        qty: qty,
        rate: unitPrice,
        dose: feeScheduleSelected.unit,
        total: Number(unitPrice) * Number(qty),
        totcopay: 0,
        clinic: opdData?.clinic || "",
        itemsrc: 2,
      }
      additionalData.push(newData);
      setEditingData(additionalData);
      triggerChange(additionalData);
    }
  };

  function onManualFreeDrugChange(selected: FeeDrugSelectorModel) {
    setDrugSelected(selected);
  }
  function onManualFreeScheduleChange(selected: FeeScheduleSelectorModel) {
    setScheduleSelected(selected);
    console.log('selected=>', selected);
    adding.current = feeScheduleSelected.item_code != undefined && feeScheduleSelected.item_code != "";

    if (selected.item_code != undefined) {
      let typeSelected = feeScheduleSelected.type || adpTypeFreeSchedule;
      formAdpAdding.setFieldsValue({
        ...adpOptionalObj,
        TypeEditor: { id: typeSelected, text: getAdpDisplay(typeSelected) },
        Price: feeScheduleSelected.price || 0,
        Dose: feeScheduleSelected.unit || "",
      });
    } else {
      formAdpAdding.setFieldsValue({
        ...adpOptionalObj,
        TypeEditor: { id: undefined, text: "" },
        Price: undefined,
        Dose: undefined,
      });
    }


  }
  //#endregion

  //#region Local Filter Data
  const columns = [
    {
      title: <p className="Center">ลำดับ</p>,
      dataIndex: "dummyKey",
      key: "dummyKey",
      width: 15,
      ellipsis: true,
      className: "Center",
    },
    {
      title: "ประเภท",
      dataIndex: "typeEditor",
      key: "typeEditor",
      width: 30,
      ellipsis: true,
      editable: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return <>{record.typeDisplay}</>
      },
    },
    {
      title: "รหัสรายการ",
      dataIndex: "feeEditor",
      key: "feeEditor",
      width: 40,
      editable: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return <>{record.isFeeDrug
          ? record.feeDrug?.name || record.feeDrug?.code
          : record.feeSchedule?.item_name || record.feeSchedule?.item_code
        }
        </>
      },
    },
    {
      title: "หน่วย",
      dataIndex: "qty",
      key: "unit",
      width: 20,
      editable: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return <>{`${record.qty} [${record.dose}]`}</>
      }
    },
    {
      title: "ราคา",
      dataIndex: "rate",
      key: "rate",
      width: 20,
      ellipsis: true,
      editable: true,
    },
    {
      title: "พึ่งเบิกได้",
      dataIndex: "total",
      key: "total",
      width: 15,
      ellipsis: true,
    },
    {
      title: "ส่วนเกิน",
      dataIndex: "totcopay",
      key: "totcopay",
      width: 15,
      ellipsis: true,
      editable: true,
    },
    {
      title: viewMode
        ? (<p className="Center">{"จัดการ"}</p>)
        : (<p className="Center"><Text type="warning">ยืนยัน ?</Text></p>),
      dataIndex: "operation",
      className: "Center",
      fixed: "right",
      width: 20,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        const editing = isEditing(record);
        return editing ? (
          <Space size="middle">
            <Button
              disabled={viewMode}
              onClick={() => saveItem(record.id)}
              type="text" size="small" block
              icon={<CheckOutlined style={{ color: 'green' }} />}
            />
            <Popconfirm
              title="Sure to cancel?"
              placement="bottom"
              onConfirm={cancel}
            >
              <Button
                disabled={viewMode}
                type="text" size="small" block danger
                icon={<CloseOutlined />}
              />
            </Popconfirm>
          </Space>
        ) : (
          <Space size="middle">
            <Tooltip title="แก้ไข">
              <Button
                disabled={!viewMode}
                onClick={() => editItem(record)}
                type="text" size="small" block
                icon={<EditTwoTone />}
              />
            </Tooltip>
            <Tooltip title="ลบออก">
              <Popconfirm
                title="Sure to delete?"
                placement="bottom"
                onConfirm={() => deleteItem(record.id)}
              >
                <Button
                  disabled={!viewMode}
                  type="text" size="small" block
                  danger
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const mergedColumns: TableProps["columns"] = columns.map((col) => {
    if (!col.editable) {
      return {
        ...col,
        onCell: (record: AdditPaymentModelEditorModel) => ({ className: record.hasError ? 'Col-Table-Row-Error' : '', })
      } as TableColumnProps<AdditPaymentModelEditorModel>;
    }
    let numTypes = ["totcopay"];
    let selectorTypes = ["feeEditor", "typeEditor"];
    return {
      ...col,
      onCell: (record: AdditPaymentModelEditorModel) => ({
        record,
        inputType: numTypes.includes(col.dataIndex)
          ? "number"
          : selectorTypes.includes(col.dataIndex)
            ? "selector"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        selectorNode: col.dataIndex == "typeEditor"
          ? <AdditPaymentTypeSelector propKey="inlineTypeEditor" /> : record.isFeeDrug
            ? <FeeDrugSelector propKey="inlineAdd" showCode />
            : <FeeScheduleSelector propKey="inlineAdd" showCode />,
        styleClass: record.hasError ? 'Col-Table-Row-Error' : '',
      }),
    } as TableColumnProps<AdditPaymentModelEditorModel>;
  });
  //#endregion

  return (
    <Space direction="vertical" >
      <Form form={formAdpAdding} layout="horizontal">
        <Row gutter={[16, 16]} style={{ width: '100%' }} justify={"space-between"} >
          {/* <Col span={9}>
          <FeeDrugSelector propKey="manualDrugAdd" showCode showPrice
            onChange={onManualFreeDrugChange} value={feeDrugSelected}
          />
        </Col>
        <Col span={3}>
          <Button
            disabled={feeDrugSelected.code == "" || feeDrugSelected.code == undefined}
            onClick={addItemFeeDrug}
            type="primary" ghost
            icon={<FileAddOutlined />}>
            เพิ่ม
          </Button>
        </Col> */}
          <Col span={16}>
            <FeeScheduleSelector propKey="manualFeeAdd" showCode
              onChange={onManualFreeScheduleChange} value={feeScheduleSelected}
            />
          </Col>
          <Col span={8}>
            <Button
              disabled={feeScheduleSelected.item_code == "" || feeScheduleSelected.item_code == undefined}
              onClick={addItemFeeSchedule}
              type="primary" ghost block
              icon={<FileAddOutlined />}>
              เพิ่ม
            </Button>
          </Col>

          {/*#Required#--------------------------*/}
          <Col span={8}>
            <Form.Item label="ประเภท" name="TypeEditor" rules={[{ required: true }]}  >
              <AdditPaymentTypeSelector propKey="manualTypeAdd" allowNull />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ราคา" name="Price" rules={[{ required: true }]}  >
              <InputNumber style={{ width: '100%' }} readOnly={adding.current} step={0.25} variant={adding.current ? "filled" : "outlined"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ปริมาณ" tooltip="DOSE : 10(เว้นวรรค)mg | 20(เว้นวรรค)mg" name="Dose" rules={[{ required: true }]}>
              <Input readOnly={adding.current} variant={adding.current ? "filled" : "outlined"} />
            </Form.Item>
          </Col>
          {/*#End#--------------------------*/}
        </Row>

        <Row gutter={[16, 0]} style={{ width: '100%' }} justify={"space-between"} >
          {/*#Cancer Group#--------------------------*/}
          <Col span={8}>
            <Form.Item label="รูปแบบมะเร็ง" tooltip="CAGCODE: กรณี Type=7" name="CagCode">
              <Select style={{ width: '100%' }}
                options={[
                  { value: 'Bd', label: '[Bd] Bladder' },
                  { value: 'Br', label: '[Br] Breast' },
                  { value: 'Ch', label: '[Ch] Cholangiocarcinoma' },
                  { value: 'Cr', label: '[Cr] ?????' },
                ]}
              />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item label="รูปแบบมะเร็ง [อื่นๆ]" tooltip="CAGCODE: กรณี Type=7" name="CagText">
              <Input readOnly={adding.current} variant={adding.current ? "filled" : "outlined"} />
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="การรักษามะเร็ง" tooltip="CA_TYPE: ประเภทการรักษามะเร็ง V=Visit" name="CaType">
              <Input readOnly={adding.current} variant={adding.current ? "filled" : "outlined"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Serial no." tooltip="SERIALNO: หมายเลข Serial Number ของอวัยวะเทียม/อุปกรณ์บำบัดรักษา(Instrument)" name="SerialNo">
              <Input readOnly={adding.current} variant={adding.current ? "filled" : "outlined"} />
            </Form.Item>
          </Col>
          {/*#End#--------------------------*/}

          {/*#Gravida Group#--------------------------*/}
          <Col span={8}>
            <Form.Item label="ครรภ์ที่" tooltip="GRAVIDA: ครรภ์ที่" name="Gravida">
              <Input readOnly={adding.current} variant={adding.current ? "filled" : "outlined"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="อายุครรภ์" tooltip="GA_WEEK: อายุครรภ์ปัจจุบัน ณ วันที่ตรวจแรก (สัปดาห์)" name="GravidaWeek">
              <InputNumber style={{ width: '100%' }} readOnly={adding.current} step={1} variant={adding.current ? "filled" : "outlined"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ประจำเดือนล่าสุด" tooltip="LMP: วันแรกของการมีประจำเดือนครั้งสุดท้าย" name="LMP">
              <DatePicker style={{ width: '100%' }} readOnly={adding.current} variant={adding.current ? "filled" : "outlined"} />
            </Form.Item>
          </Col>
          {/*#End#--------------------------*/}

        </Row>
      </Form>
      <Form form={formAdpEditor} component={false}>
        <Table
          rowKey={(record) => record.id}
          components={{
            body: {
              cell: EditableCell<AdditPaymentModelEditorModel>,
            },
          }}
          columns={mergedColumns}
          dataSource={editingAdditionalData}
          size="small"
          className={"MasterBackground"}
          pagination={{ pageSize: 10, simple: true }}
          style={{ margin: "10px 0", height: "500px", width: "100%" }}
          sticky
          scroll={{ x: 400 }}
        />
      </Form>
    </Space>
  );
};

export default InvoiceAdditionalPage;
