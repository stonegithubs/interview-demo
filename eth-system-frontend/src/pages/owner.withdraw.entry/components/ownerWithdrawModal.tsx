import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Spin, Typography } from 'antd';
import styles from '../index.less';
import { ContractCurrencyType, OwnerWithdrawConfigType } from '@/pages/owner.withdraw.entry/data';
import { ContractCurrencyService } from '@/service/contract.currency.service';
import { OwnerWithdrawConfigService } from '@/service/owner.withdraw.config.service';
import numeral from 'numeral';

interface EditModalProps {
  done: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OwnerWithdrawModal: FC<EditModalProps> = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [contractCurrency, setContractCurrency] = useState<ContractCurrencyType>();
  const [ownerWithdrawConfig, setOwnerWithdrawConfig] = useState<OwnerWithdrawConfigType>();
  const { done, onCancel, onSubmit } = props;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ContractCurrencyService.getContractCurrency(),
      OwnerWithdrawConfigService.getOwnerWithdrawConfig(),
    ]).then(([contractCurrency, ownerWithdrawConfig]) => {
      setOwnerWithdrawConfig(ownerWithdrawConfig);
      setContractCurrency(contractCurrency);
      form.setFieldsValue(contractCurrency);
      setLoading(false);
    });
    return () => {
      form.resetFields();
      setLoading(true);
    };
  }, []);

  const getMax = (): number => {
    if (contractCurrency) {
      return contractCurrency.balance;
    }
    return 100_000;
  };

  const maxMoney = () => {
    form.setFieldsValue({ ...contractCurrency, cryptoAmount: contractCurrency?.balance });
  };

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(values as ContractCurrencyType);
    }
  };

  const getFee = () => {
    if (ownerWithdrawConfig) {
      if (ownerWithdrawConfig.isEnableFeeAmount) {

        return `提现会收取 ${numeral(ownerWithdrawConfig.feeAmount).format('0.000000')} 手续费`;
      }
      return `提现会收取 ${ownerWithdrawConfig.feePercent} %手续费`;
    }
    return '';
  };

  const modalFooter = done
    ? { footer: null, onCancel: onCancel }
    : { okText: '提现', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center' }}><Spin/></div>;
    }

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item name="currencyId" hidden initialValue={2}>
          <Input/>
        </Form.Item>
        <Form.Item
          name="balance"
          label="USDT馀额$"
        >
          <Typography.Text className={'ant-form-text'}>
            {contractCurrency?.balance}
          </Typography.Text>
        </Form.Item>
        <Form.Item
          name="toAddress"
          label="提现地址"
          rules={[{ required: true, message: '请输入提现地址' }]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="cryptoAmount"
          label="提现金额"
          extra={getFee()}
          rules={[{ required: true, message: '请输入提现金额' }]}
        >
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item noStyle name="cryptoAmount">
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={getMax()}
                  step="0.000001"
                  precision={6}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button onClick={() => maxMoney()}>最大值</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={'提现'}
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

export default OwnerWithdrawModal;
