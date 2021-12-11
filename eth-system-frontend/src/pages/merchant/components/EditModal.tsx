import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Spin } from 'antd';
import styles from '../index.less';
import { MerchantType } from '@/pages/merchant/data';
import { MerchantService } from '@/service/merchant.service';

interface EditModalProps {
  done: boolean;
  current: MerchantType | undefined;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const EditModal: FC<EditModalProps> = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const { done, current, onCancel, onSubmit } = props;

  useEffect(() => {
    if (current) {
      getMerchant(current.id).then(merchant => {
        form.setFieldsValue(merchant);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return ()=> {
      form.resetFields();
      setLoading(true);
    }
  }, []);

  const getMerchant = async (id: number): Promise<MerchantType> => {
    return await MerchantService.getOne(id);
  };

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(values as MerchantType);
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onCancel }
    : { okText: '保存', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center' }}><Spin/></div>;
    }

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="id"
          label="商號id"
        >
          <Input placeholder="请输入" disabled/>
        </Form.Item>
        <Form.Item
          name="number"
          label="商號"
        >
          <Input placeholder="请输入" disabled/>
        </Form.Item>
        <Form.Item
          name="feePercent"
          label="入款手續費(%)"
          rules={[{ required: true, message: '請輸入入款手續費' }]}
        >
          <InputNumber min="0" max="100" step="0.01" placeholder="0 ~ 100" precision={2}/>
        </Form.Item>
        <Form.Item
          name="withdrawFeePercent"
          label="出款手續費(%)"
          rules={[{ required: true, message: '請輸入出款手續費' }]}
        >
          <InputNumber min="0" max="100" step="0.01" placeholder="0 ~ 100" precision={2}/>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={`${current ? '编辑商號' : '添加商號'}`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
      destroyOnClose
      visible={true}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default EditModal;
