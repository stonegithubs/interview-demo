import React from 'react';
import { Card, Tooltip } from 'antd';
import { DollarOutlined, ReloadOutlined } from '@ant-design/icons';
import numeral from 'numeral';

interface ContractCurrencyProps {
  loading: boolean;
  data: { balance: number, error?: boolean };
  onBalanceReload: () => void;
  openOwnerWithdrawModal: () => void;
}

export const ContractCurrency = ({
  loading,
  data,
  onBalanceReload,
  openOwnerWithdrawModal,
}: ContractCurrencyProps) => (
  <Card
    title={'USDT馀额'}
    loading={loading}
    style={{ width: 300, marginBottom: 16 }}
    actions={[
      <Tooltip title="刷新金额"><ReloadOutlined key="reload" onClick={onBalanceReload}/></Tooltip>,
      <Tooltip title="提现"><DollarOutlined key="owner_withdraw" onClick={openOwnerWithdrawModal}/></Tooltip>,
    ]}
  >
    <div style={{ textAlign: 'center' }}>
      {loading && <ReloadOutlined key="reload" spin={true} style={{ fontSize: '1.7rem' }}/>}
      {!loading && data.error && <span>获取金额失败，请刷新重试!</span>}
      {!loading && !data.error &&
      <span style={{ fontSize: '1.7rem' }}>$ {numeral(data.balance).format('0,0.000000')}</span>}
    </div>
  </Card>
);
