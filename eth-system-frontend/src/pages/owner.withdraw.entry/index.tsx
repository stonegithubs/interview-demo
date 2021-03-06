import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { AuthService } from '@/service/auth.service';
import { TokenService } from '@/service/token.service';
import { history } from '@@/core/history';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { EntryType, OwnerWithdrawType } from '@/pages/owner.withdraw.entry/data';
import numeral from 'numeral';
import { Dropdown, Menu, message as antdMessage } from 'antd';
import { OwnerWithdrawEntryService } from '@/service/owner.withdraw.entry.service';
import ConfirmModal from '@/pages/owner.withdraw.entry/components/ConfirmModal';
import { ContractCurrency } from '@/pages/owner.withdraw.entry/components/ContractCurrency';
import { ContractCurrencyService } from '@/service/contract.currency.service';
import OwnerWithdrawModal from '@/pages/owner.withdraw.entry/components/ownerWithdrawModal';
import { TradeService } from '@/service/trade.service';

export default function OwnerWithdrawEntry() {
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [current, setCurrent] = useState<EntryType | undefined>();
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  const [balanceData, setBalanceData] = useState<{ balance: number, error: boolean }>({ balance: 0, error: false });
  const [showOwnerWithdrawModal, setShowOwnerWithdrawModal] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const fetchContractCurrency = async () => {
    setBalanceLoading(true);
    return await ContractCurrencyService.getContractCurrency().then(res => {
      setBalanceData({ balance: res.balance, error: false });
      setBalanceLoading(false);
    }).catch(err => {
      antdMessage.error(err);
      setBalanceData({ balance: 0, error: true });
      setBalanceLoading(false);
    });
  };

  const fetchData = async (params: Record<string, any> & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }) => {
    const firstResult = (params?.current as number - 1 || 0) * (params?.pageSize as number || 0);
    const p: Record<string, any> = {
      id: params.id,
      isProcess: params.isProcess,
      isConfirmed: params.isConfirmed,
      isCompleted: params.isCompleted,
      isFailed: params.isFailed,
      isManual: params.isManual,
      firstResult,
      maxResults: params.pageSize || 20,
    };
    Object.keys(p).forEach(key => p[key] === undefined ? delete p[key] : {});
    return await OwnerWithdrawEntryService.getList(p);
  };
  const openConfirmEntryModal = (record: EntryType) => {
    setShowConfirmModal(true);
    setCurrent(record);
  };
  const handleCancel = () => {
    setShowConfirmModal(false);
    setShowOwnerWithdrawModal(false);
  };
  const confirmEntry = (values: EntryType) => {
    const data = {
      id: values.id,
      txnHash: values.txnHash,
    };
    OwnerWithdrawEntryService.confirm(data).then(res => {
      antdMessage.success('??????????????????');
      setShowConfirmModal(false);
      actionRef.current?.reload();
    }).catch(err => {
      antdMessage.error('??????????????????');
      console.log(err);
    });
  };
  const onBalanceReload = () => fetchContractCurrency();

  const onOwnerWithdraw = (values: OwnerWithdrawType) => {
    TradeService.ownerWithdraw(values).then(res => {
      fetchContractCurrency();
      actionRef.current?.reload();
      antdMessage.success('????????????????????????????????????');
      setShowOwnerWithdrawModal(false);
    }).catch(err => {
      antdMessage.error(err.message);
    });
  };

  const searchColumns: ProColumns<EntryType>[] = [
    {
      title: '?????????',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '???????????????',
      dataIndex: 'currencyId',
      valueType: 'select',
      valueEnum: {
        USDTERC20: { text: 'USDT(ERC20)' },
      },
      initialValue: 'USDTERC20',
      hideInTable: true,
      search: {
        transform: (value: any) => {
          switch (value) {
          case 'USDTERC20':
            return { currencyId: 2 };
          }
          return {};
        },
      },
    },
    {
      title: '????????????',
      valueType: 'dateRange',
      dataIndex: 'createdAt',
      search: {
        transform: (value: any) => ({
          createdAtStart: `${value[0]} 00:00:00`,
          createdAtEnd: `${value[1]} 23:59:59`,
        }),
      },
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        isManual: { text: '??????????????????' },
        isConfirmed: { text: '??????' },
        isProcess: { text: '?????????' },
      },
      hideInTable: true,
      search: {
        transform: (value: any) => {
          return { [value]: 1 };
        },
      },
    },
  ];
  const columns: ProColumns<EntryType>[] = [
    {
      title: '?????????',
      dataIndex: 'id',
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '???????????????',
      hideInSearch: true,
      render: (text, record, _, action) =>
        <>{record.currency.name}</>,
    },
    {
      title: '??????????????????',
      dataIndex: 'cryptoAmount',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0.000000');
      },
    },
    {
      title: '?????????',
      dataIndex: 'fee',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0.000000');
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'realCryptoAmount',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0.000000');
      },
    },
    {
      title: '????????????',
      valueType: 'dateTime',
      dataIndex: 'createdAt',
      hideInSearch: true,
    },
    {
      title: 'hash',
      dataIndex: 'txnHash',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '?????????',
      render: (text, record, _, action) => {
        return record?.user?.username || null;
      },
      hideInSearch: true,
    },
    {
      title: '??????',
      valueType: 'option',
      render: (text, record, _, action) => {
        const { isProcess, isConfirmed, isCompleted, isFailed, isManual } = record;
        if (isManual) {
          return '??????????????????';
        }
        if (isConfirmed) {
          return '????????????';
        }
        return '?????????';
      },
    },
    {
      title: '??????',
      valueType: 'option',
      render: (text, record, _, action) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="1"
              onClick={() => openConfirmEntryModal(record)}
              disabled={record.isConfirmed || record.isFailed}
            >
              ????????????
            </Menu.Item>
          </Menu>
        );

        return <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            ??????
          </a>
        </Dropdown>;
      },
    },
  ];

  useEffect(() => {
    const getIsLogin = async () => {
      try {
        const isLogin = await AuthService.isLogin();
        if (!isLogin) {
          TokenService.removeAuthToken();
          return history.push('/login');
        }

        setLoading(false);
      } catch (err) {
        return history.push('/login');
      }
    };
    getIsLogin();
    fetchContractCurrency();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <PageContainer>
      <ContractCurrency
        loading={balanceLoading}
        data={balanceData}
        onBalanceReload={onBalanceReload}
        openOwnerWithdrawModal={() => setShowOwnerWithdrawModal(true)}
      />
      <div className={styles.standardList}>
        <ProTable<EntryType>
          columns={searchColumns.concat(columns)}
          actionRef={actionRef}
          request={async (params = {}, sort, filter) => {
            const res = await fetchData(params);
            return { data: res.entries, total: res.total };
          }}
          rowKey="id"
          search={{ labelWidth: 'auto' }}
          pagination={{
            pageSize: 20,
            onChange: (a, b) => {
              actionRef.current?.reload();
            },
          }}
          dateFormatter="string"
          headerTitle="????????????"
        />
      </div>
      {showConfirmModal && <ConfirmModal
        done={false}
        current={current}
        onCancel={handleCancel}
        onSubmit={confirmEntry}
      />}
      {showOwnerWithdrawModal && <OwnerWithdrawModal
        done={false}
        onCancel={handleCancel}
        onSubmit={onOwnerWithdraw}
      />}
    </PageContainer>
  );
}
