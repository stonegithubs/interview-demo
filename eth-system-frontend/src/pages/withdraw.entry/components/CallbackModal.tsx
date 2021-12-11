import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Spin } from 'antd';
import styles from '../index.less';
import { EntryType } from '@/pages/entry/data';
import { EntryService } from '@/service/entry.service';
import { WithdrawEntryService } from '@/service/withdraw.entry.service';

interface CallbackModalProps {
  done: boolean;
  current: EntryType | undefined;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CallbackModal: FC<CallbackModalProps> = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const { done, current, onCancel, onSubmit } = props;

  useEffect(() => {
    if (current) {
      getEntry(current.id).then(entry => {
        form.setFieldsValue(entry);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      form.resetFields();
      setLoading(true);
    };
  }, []);

  const getEntry = async (id: number | string): Promise<EntryType> => {
    return await WithdrawEntryService.getOne(id);
  };

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(values as EntryType);
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onCancel }
    : { okText: '回調', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center' }}><Spin/></div>;
    }

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="id"
          label="訂單號"
        >
          <Input placeholder="请输入" disabled/>
        </Form.Item>
        <Form.Item
          name="cbUrl"
          label="回調網址"
        >
          <Input disabled={true}/>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title="手動回調"
      className={styles.standardListForm}
      width={850}
      bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
      destroyOnClose
      visible={true}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default CallbackModal;
