
"use client";

//#region Import
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Typography, Table, Form, Space, Popconfirm, Tooltip, Row, Col, Input, InputNumber, Select, DatePicker, Collapse } from "antd";
import type { TableProps, TableColumnProps } from "antd";
import { EditTwoTone, CheckOutlined, CloseOutlined, DeleteOutlined, FileAddOutlined, MoreOutlined, WarningTwoTone, } from "@ant-design/icons";
import { AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";
import { EditableCell } from "@/client.component/antd.table.editable";
import { FeeDrugSelector } from "@/app/catalogs/selector.fee.drug";
import { FeeScheduleSelector } from "@/app/catalogs/selector.fee.schedule";
import { AdditPaymentTypeSelector } from "@/app/catalogs/selector.adp.type";
import { isNumber } from "@/client.constant/format.constant";
import { FeeDrugSelectorModel } from "@/store/fee-additional/feeDrugModel";
import { FeeScheduleSelectorModel } from "@/store/fee-additional/feeScheduleModel";
import { adpTypeFreeSchedule, adpTypeNonGroup, getErrorToAdpCharges } from "@/client.constant/invoice.additional.constant";
import { adpOptionalObj, getAdpDisplay } from "@/client.constant/invoice.addit.payment.constant";
import { VisitDetailModel } from "@/store/work/workEditorModel";
import "@/app/globals.css";
//#endregion

type InvoiceAdditionalProps = {
  visitDetail?: VisitDetailModel,
  additionalItems?: AdditPaymentModelEditorModel[],
  adpTypes: string[],
  showFeeDrug: boolean,
  onChange?: any
};

const { Text } = Typography;

const InvoiceAdditionalPage = function InvoiceAdditional({ visitDetail, additionalItems = [], adpTypes, showFeeDrug, onChange }: InvoiceAdditionalProps) {

  const [formAdpEditor] = Form.useForm();
  const [formAdpAdding] = Form.useForm();
  const [editingAdditionalData, setEditingData] = useState<AdditPaymentModelEditorModel[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const defaultFeeDrug = { id: "", code: "", unitPrice: "" };
  const [feeDrugSelected, setDrugSelected] = useState<FeeDrugSelectorModel>(defaultFeeDrug);
  const defaultFeeSchedule = { item_code: undefined, item_name: "" };
  const [feeScheduleSelected, setScheduleSelected] = useState<FeeScheduleSelectorModel>(defaultFeeSchedule);
  const [showDetail, setShowDetail] = useState(false);
  const adding = useRef(false);
  const [pageIndex, setPageIndex] = useState(1);
  const defaultPageSize = 5;

  useEffect(() => {
    // console.log('invoice.additional', additionalItems);
    clearEditingItem();
    setEditingData(additionalItems);
  }, [additionalItems]);

  const triggerChange = (additionalData: AdditPaymentModelEditorModel[]) => {
    // console.log('additionalData', additionalData)
    onChange?.({ adpItems: additionalData });
    let moveNext = Number(additionalData.length) > (Number(pageIndex) * Number(defaultPageSize));
    let newPageIndex = moveNext
      ? pageIndex + 1
      : pageIndex;
    setPageIndex(newPageIndex);
  };

  //#region Editor
  const cancel = () => {
    clearEditingItem();
  };

  function clearEditingItem(): void {
    formAdpEditor.resetFields();
    formAdpAdding.setFieldsValue({ ...adpOptionalObj });
    setDrugSelected(defaultFeeDrug);
    setScheduleSelected(defaultFeeSchedule);
    setEditingKey("");
    setPageIndex(1);
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
      // console.log("row=>", row);
      const newData = [...editingAdditionalData];
      const index = newData.findIndex((item) => key == item.id);
      // console.log("index=>", index);
      let hasCode: boolean = (row.code != '');
      if (index > -1) {
        const item = newData[index];
        if (item.isFeeDrug) {
          let rowFeeDrug = row.feeEditor as FeeDrugSelectorModel;
          row.feeDrug = { ...rowFeeDrug };
          if ((rowFeeDrug.code).length > 0) row.code = rowFeeDrug.code || row.code;
          if (isNumber(Number(rowFeeDrug.unitPrice))) {
            let rowFeeDrugPrice = Number(rowFeeDrug.unitPrice);
            let unitPrice = (rowFeeDrugPrice == 0 || rowFeeDrugPrice < Number(row.rate)) ? Number(row.rate) : rowFeeDrugPrice;
            let totalreq = unitPrice * Number(row.qty);
            row.rate = unitPrice
            row.total = totalreq;
          } else {
            row.total = Number(row.rate) * Number(row.qty);
          }
        } else {
          let rowFeeSchedule = row.feeEditor as FeeScheduleSelectorModel;
          row.feeSchedule = { ...rowFeeSchedule };
          if ((rowFeeSchedule.item_code || '').length > 0) row.code = rowFeeSchedule.item_code || row.code;
          if (isNumber(Number(rowFeeSchedule.price))) {
            let rowFeeSchedulePrice = Number(rowFeeSchedule.price);
            let unitPrice = (rowFeeSchedulePrice == 0 || rowFeeSchedulePrice < Number(row.rate)) ? Number(row.rate) : rowFeeSchedulePrice;
            let totalreq = unitPrice * Number(row.qty);
            row.rate = unitPrice
            row.total = totalreq;
          } else {
            row.total = Number(row.rate) * Number(row.qty);
          }
        }

        if (item.type != row.typeEditor.id) {
          item.type = row.typeEditor.id;
          item.typeDisplay = row.typeEditor.text;
        }

        newData.splice(index, 1, {
          ...item,
          ...row,
          hasError: !hasCode,
          validError: hasCode ? [] : item.validError,
        });
        setEditingData(newData);
        setEditingKey("");
      } else {
        newData.push({ ...row, hasError: !hasCode, validError: hasCode ? [] : getErrorToAdpCharges(key.toString()), });
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
  const addItemFeeDrug = async () => {
    const formData = (await formAdpAdding.validateFields());
    const additionalData = [...editingAdditionalData];
    let newId = uuidv4();
    if (feeDrugSelected.code != "" && feeDrugSelected.code != undefined) {
      const newData: AdditPaymentModelEditorModel = {
        dummyKey: newId.split('-')[0],
        isDurty: true,
        hasError: false,
        id: newId,
        seq: visitDetail?.seq || "",
        an: visitDetail?.an || "",
        hn: visitDetail?.hn || "",
        dateopd: visitDetail?.visitDate || new Date,
        type: formData.TypeEditor.id,
        typeDisplay: formData.TypeEditor.text,
        typeEditor: { id: formData.TypeEditor.id, text: formData.TypeEditor.text },
        code: formData.Code,
        feeDrug: { ...feeDrugSelected },
        feeEditor: { ...feeDrugSelected },
        isFeeDrug: true,
        qty: Number(formData.Qty),
        rate: Number(formData.Rate),
        dose: formData.Dose,
        total: Number(formData.Total),
        totcopay: Number(formData.OverPayment),
        clinic: visitDetail?.clinic || "",
        itemsrc: formData.ItemSource,
        cagcode: formData.CagCode,
        ca_type: formData.CaType,
        serialno: formData.SerialNo,
        use_status: formData.UseStatus,
        tmltcode: formData.TmltCode,
        status1: formData.Status1,
        bi: formData.BI,
        provider: formData.Provider,
        gravida: formData.Gravida,
        ga_week: formData.GravidaWeek,
        dcip_e_screen: formData.ScreenCode,
        lmp: formData.LMP,
        qtyday: formData.QtyDay,
      }
      additionalData.push(newData);
      setEditingData(additionalData);
      triggerChange(additionalData);
    }
  };

  const addItemFeeSchedule = async () => {
    const formData = (await formAdpAdding.validateFields());
    const additionalData = [...editingAdditionalData];
    let newId = uuidv4();
    if (feeScheduleSelected.item_code != "" && feeScheduleSelected.item_code != undefined) {
      const newData: AdditPaymentModelEditorModel = {
        dummyKey: newId.split('-')[0],
        isDurty: true,
        hasError: false,
        id: newId,
        seq: visitDetail?.seq || "",
        an: visitDetail?.an || "",
        hn: visitDetail?.hn || "",
        dateopd: visitDetail?.visitDate || new Date,
        type: formData.TypeEditor.id,
        typeDisplay: formData.TypeEditor.text,
        typeEditor: { id: formData.TypeEditor.id, text: formData.TypeEditor.text },
        code: formData.Code,
        feeSchedule: { ...feeScheduleSelected },
        feeEditor: { ...feeScheduleSelected },
        isFeeDrug: false,
        qty: Number(formData.Qty),
        rate: Number(formData.Rate),
        dose: formData.Dose,
        total: Number(formData.Total),
        totcopay: Number(formData.OverPayment),
        clinic: visitDetail?.clinic || "",
        itemsrc: formData.ItemSource,
        cagcode: formData.CagCode,
        ca_type: formData.CaType,
        serialno: formData.SerialNo,
        use_status: formData.UseStatus,
        tmltcode: formData.TmltCode,
        status1: formData.Status1,
        bi: formData.BI,
        provider: formData.Provider,
        gravida: formData.Gravida,
        ga_week: formData.GravidaWeek,
        dcip_e_screen: formData.ScreenCode,
        lmp: formData.LMP,
        qtyday: formData.QtyDay,
      }
      additionalData.push(newData);
      setEditingData(additionalData);
      triggerChange(additionalData);
    }
  };

  function onManualFreeDrugChange(selected: FeeDrugSelectorModel) {
    setDrugSelected(selected);
    adding.current = selected.code != undefined && selected.code != "";

    if (selected.code != undefined && selected.code != "") {
      let typeSelected = adpTypeNonGroup;
      let qty = 1;
      let unitPrice = isNumber(Number(selected.unitPrice)) ? Number(selected.unitPrice) : 0;
      formAdpAdding.setFieldsValue({
        ...adpOptionalObj,
        Code: selected.code,
        TypeEditor: { id: typeSelected, text: getAdpDisplay(typeSelected), disabled: false },
        Qty: 1,
        Total: Number(unitPrice) * Number(qty),
        OverPayment: 0,
        Rate: unitPrice,
        Dose: selected.strength || "",
        ItemSource: 2,
      });
    } else {
      formAdpAdding.setFieldsValue({ ...adpOptionalObj });
    }
  }

  function onManualFreeScheduleChange(selected: FeeScheduleSelectorModel) {
    setScheduleSelected(selected);
    adding.current = selected.item_code != undefined && selected.item_code != "";

    if (selected.item_code != undefined) {
      let typeSelected = selected.type || adpTypeFreeSchedule;
      formAdpAdding.setFieldsValue({
        ...adpOptionalObj,
        Code: selected.item_code,
        TypeEditor: { id: typeSelected, text: getAdpDisplay(typeSelected), disabled: false },
        Qty: 1,
        Total: selected.price || 0,
        OverPayment: 0,
        Rate: selected.price || 0,
        Dose: selected.unit || "",
        ItemSource: 2,
      });
    } else {
      formAdpAdding.setFieldsValue({ ...adpOptionalObj });
    }
  }
  //#endregion

  //#region Local Filter Data
  const columns = [
    {
      title: <p className="Center">คีย์หลัก</p>,
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
      width: 25,
      ellipsis: true,
      editable: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return <Tooltip title={record.typeDisplay}>
          {(record.typeDisplay || []).length > 18
            ? `${record.typeDisplay?.substring(0, 18)}...`
            : record.typeDisplay
          }</Tooltip>
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
      title: <p className="Center">{"ไม่ผ่าน"}</p>,
      dataIndex: "validError",
      key: "validError",
      className: "Center",
      width: 10,
      ellipsis: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return record.validError?.map((i, index) => {
          return (
            <Tooltip key={index} title={`${i.code_error}: ${i.code_error_descriptions}`} >
              <WarningTwoTone twoToneColor="#ffab00" style={{ fontSize: '20px' }} />
            </Tooltip >
          );
        });
      },
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
            <Popconfirm okText="ใช่" cancelText="ไม่"
              title="แน่ใจการ[ยกเลิก] ?"
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
              {/* <Popconfirm okText="ใช่" cancelText="ยกเลิก"
                title="แน่ใจการ[ลบ] ?"
                placement="bottom"
                onConfirm={() => deleteItem(record.id)}
              > */}
              <Button
                onClick={() => deleteItem(record.id)}
                disabled={!viewMode}
                type="text" size="small" block
                danger
                icon={<DeleteOutlined />}
              />
              {/* </Popconfirm> */}
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
            ? <FeeDrugSelector propKey="inlineAdd" showPrice />
            : <FeeScheduleSelector propKey="inlineAdd" showPrice types={adpTypes} />,
        styleClass: record.hasError ? 'Col-Table-Row-Error' : '',
      }),
    } as TableColumnProps<AdditPaymentModelEditorModel>;
  });

  const onTableCriteriaChange: TableProps<AdditPaymentModelEditorModel>['onChange'] = (pagination, filters, sorter, extra) => {
    setPageIndex(pagination.current ?? 1);
    console.log('pagination.current=>', pagination.current);
  };
  //#endregion

  return (
    <Space direction="vertical" >
      <Form form={formAdpAdding} layout="horizontal">
        <Row gutter={[16, 16]} style={{ width: '100%' }} justify={"space-between"} >
          {
            showFeeDrug ?
              <>
                <Col span={9}>
                  <FeeDrugSelector propKey="manualDrugAdd" showCode
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
                </Col>
              </>
              : <></>
          }
          <Col span={showFeeDrug ? 9 : 18}>
            <FeeScheduleSelector propKey="manualFeeAdd" showCode showPrice={!showFeeDrug} allowNull types={adpTypes}
              onChange={onManualFreeScheduleChange} value={feeScheduleSelected}
            />
          </Col>
          <Col span={showFeeDrug ? 3 : 6}>
            <Button
              disabled={feeScheduleSelected.item_code == "" || feeScheduleSelected.item_code == undefined}
              onClick={addItemFeeSchedule}
              type="primary" ghost block
              icon={<FileAddOutlined />}>
              เพิ่ม
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 0]} style={{ width: '100%', marginTop: 20 }} justify={"space-between"} >
          {/*#Required#--------------------------*/}
          <Col span={8}>
            <Form.Item label="จำนวน" tooltip="QTY: หน่วยนับ เป็นจำนวนครั้งหรือจำนวนเม็ด ของอุปกรณ์ บำบัดรักษา และจำนวนยาที่ใช้"
              name="Qty" rules={[{ required: true }]}  >
              <InputNumber style={{ width: '100%' }} readOnly={!adding.current} step={0.5} variant={adding.current ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="พึ่งเบิกได้" tooltip="TOTAL: จำนวนเงินรวมขอเบิก"
              name="Total" rules={[{ required: true }]}  >
              <InputNumber style={{ width: '100%' }} readOnly={!adding.current} step={0.5} variant={adding.current ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ส่วนเกิน" tooltip="TOTCOPAY: จำนวนเงินรวม(บาท) ในส่วนที่เบิกไม่ได้"
              name="OverPayment" rules={[{ required: true }]}  >
              <InputNumber style={{ width: '100%' }} readOnly={!adding.current} step={0.5} variant={adding.current ? "outlined" : "filled"} />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item label="รหัส" tooltip="CODE: รหัสตามที่ สปสช. กำหนด สามารถใส่รหัสตามเงื่อนไข"
              name="Code" rules={[{ required: true }]}  >
              <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ประเภท" tooltip="TYPE"
              name="TypeEditor" rules={[{ required: true }]}  >
              <AdditPaymentTypeSelector propKey="manualTypeAdd" allowNull showCode />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="ราคา" tooltip="RATE: ราคาต่อหน่วย"
              name="Rate" rules={[{ required: true }]}  >
              <InputNumber style={{ width: '100%' }} readOnly={!adding.current} step={0.25} variant={adding.current ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="ปริมาณ" tooltip="DOSE: 10(เว้นวรรค)mg | 20(เว้นวรรค)mg"
              name="Dose" /*rules={[{ required: true }]}*/>
              <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          {/*#End#--------------------------*/}
        </Row>

        <Collapse
          size="small" bordered={false} style={{ margin: 0, marginLeft: -15, marginTop: -10, marginBottom: 5 }}
          collapsible="icon" activeKey={showDetail ? '1' : '0'}
          items={[
            {
              key: "1",
              showArrow: false,
              extra: <Tooltip title="ข้อมูลโดยละเอียด"><MoreOutlined style={{ fontSize: '24px' }} onClick={() => setShowDetail(!showDetail)} /></Tooltip>,
              label: (
                <Row gutter={[16, 0]} style={{ width: '100%', margin: 0, marginBottom: -20 }} justify={"space-between"} >
                  <Col span={6}>
                    <Form.Item label="ประเภทรหัส" tooltip="ITEMSRC: กรณีไม่ระบุค่านี้ ระบบจะค้นรหัสจาก Lookup โดยให้ความสำคัญกับรหัสกรมบัญชีกลาง/รหัสที่ สปสช. กำหนดก่อน"
                      name="ItemSource" rules={[{ required: true }]}>
                      <Select style={{ width: '100%' }} disabled={!adding.current} popupMatchSelectWidth={200}
                        options={[
                          { value: 1, label: 'รหัสหน่วยบริการ' },
                          { value: 2, label: 'รหัสกรมบัญชีกลาง/รหัสที่ สปสช. กำหนด' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="TMLT CODE" tooltip="TMLTCODE: รหัสการตรวจ ตามบัญชีรายการ TMLT ที่ประกาศโดย สมสท."
                      name="TmltCode" /*</Col>rules={[{ required: true }]}*/>
                      <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="ผู้ให้บริการ" tooltip="PROVIDER: ผู้ให้บริการที่เกี่ยวข้อง ตามเลขที่ใบประกอบวิชาชีพ"
                      name="Provider" >
                      <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="BI" tooltip="BI: ค่า Barthel ADL Index ใส่ตัวเลขจำนวน 3 หลัก"
                      name="BI">
                      <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                </Row>
              ),
              children: (
                <Row gutter={[16, 0]} style={{ width: '100%' }} justify={"space-between"} >

                  {/*#Cancer Group#--------------------------*/}
                  <Col span={8}>
                    <Form.Item label="รูปแบบมะเร็ง" tooltip="CAGCODE: กรณี Type=7"
                      name="CagCode">
                      <Select style={{ width: '100%' }} disabled={!adding.current} popupMatchSelectWidth={200}
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
              <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
            </Form.Item>
          </Col> */}
                  <Col span={8}>
                    <Form.Item label="การรักษามะเร็ง" tooltip="CA_TYPE: ประเภทการรักษามะเร็ง V=Visit"
                      name="CaType">
                      <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Serial no." tooltip="SERIALNO: หมายเลข Serial Number ของอวัยวะเทียม/อุปกรณ์บำบัดรักษา(Instrument)"
                      name="SerialNo">
                      <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                  {/*#End#--------------------------*/}

                  {/*#Gravida Group#--------------------------*/}
                  <Col span={8}>
                    <Form.Item label="ครรภ์ที่" tooltip="GRAVIDA: บันทึกการตั้งครรภ์ครั้งที่ เป็นตัวเลขไม่เกิน 2 หลัก"
                      name="Gravida">
                      <Input allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="อายุครรภ์" tooltip="GA_WEEK: อายุครรภ์ปัจจุบัน ณ วันที่ตรวจครั้งแรก (สัปดาห์)"
                      name="GravidaWeek">
                      <InputNumber style={{ width: '100%' }} readOnly={!adding.current} step={1} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="ประจำเดือนล่าสุด" tooltip="LMP: วันแรกของการมีประจำเดือนครั้งสุดท้าย"
                      name="LMP">
                      <DatePicker style={{ width: '100%' }} allowClear readOnly={!adding.current} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                  {/*#End#--------------------------*/}
                  {/*#Other#--------------------------*/}
                  <Col span={6}>
                    <Form.Item label="รหัสคัดกรอง" tooltip="DCIP/E_screen: รหัสค่าการคัดกรอก โดยกำหนดเป็นตัวเลขไม่เกิน 2 หลัก"
                      name="ScreenCode">
                      <Select style={{ width: '100%' }} disabled={!adding.current}
                        options={[
                          { value: '28', label: 'Positive' },
                          { value: '29', label: 'Negative' },
                          { value: '30', label: 'Not done' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="สถานะการใช้" tooltip="USE_STATUS: OFC/LGO กรณี Type=11 จะต้องกำหนดค่าเหล่านี้"
                      name="UseStatus">
                      <Select style={{ width: '100%' }} disabled={!adding.current} popupMatchSelectWidth={200}
                        options={[
                          { value: '1', label: 'ใช้ในโรงพยาบาล' },
                          { value: '2', label: 'ใช้ที่บ้าน' },
                          { value: '3', label: 'ยาเกิน 2 สัปดาห์(กลับบ้าน)' },
                          { value: '4', label: 'ยาโรคเรื้อรัง(กลับบ้าน)' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="ผลตรวจโควิด" tooltip="STATUS1: ผลการตรวจ LAB COVID"
                      name="Status1">
                      <Select style={{ width: '100%' }} disabled={!adding.current}
                        options={[
                          { value: '0', label: 'Negative' },
                          { value: '1', label: 'Positive' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="จำนวนวันที่" tooltip="QTYDAY: จำนวนวันที่ขอเบิก สำหรับ UC ใช้ในกรณี Type=3 และมีการเบิก Morphine หรือ Oxygen"
                      name="QtyDay">
                      <InputNumber style={{ width: '100%' }} readOnly={!adding.current} step={1} variant={adding.current ? "outlined" : "filled"} />
                    </Form.Item>
                  </Col>
                  {/*#End#--------------------------*/}
                </Row>
              ),
            },
          ]}
        />
      </Form>
      <Form form={formAdpEditor} component={false} style={{}} >
        <Table
          rowKey={(record) => record.id}
          components={{
            body: {
              cell: EditableCell<AdditPaymentModelEditorModel>,
            },
          }}
          columns={mergedColumns}
          dataSource={editingAdditionalData}
          size="small" bordered
          className={"MasterBackground"}
          onChange={onTableCriteriaChange}
          pagination={{ pageSize: defaultPageSize, current: pageIndex, showSizeChanger: true, position: ["bottomLeft"] }}
          style={{ margin: 0, height: "300px", width: "99%" }}
          sticky scroll={{ x: 400, y: 270 }}
        />
      </Form>
    </Space>
  );
};

export default InvoiceAdditionalPage;