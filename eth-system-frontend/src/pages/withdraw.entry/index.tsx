import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { AuthService } from '@/service/auth.service';
import { TokenService } from '@/service/token.service';
import { history } from '@@/core/history';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { EntryType } from '@/pages/withdraw.entry/data';
import numeral from 'numeral';
import { Dropdown, Menu, message as antdMessage } from 'antd';
import ConfirmModal from '@/pages/withdraw.entry/components/ConfirmModal';
import CallbackModal from '@/pages/withdraw.entry/components/CallbackModal';
import { WithdrawEntryService } from '@/service/withdraw.entry.service';

export default function WithdrawEntry() {
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showCallbackModal, setShowCallbackModal] = useState<boolean>(false);
  const [current, setCurrent] = useState<EntryType | undefined>();
  const actionRef = useRef<ActionType>();

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
      firstResult,
      maxResults: params.pageSize || 20,
    };
    Object.keys(p).forEach(key => p[key] === undefined ? delete p[key] : {});
    return await WithdrawEntryService.getList(p);
  };
  const openConfirmEntryModal = (record: EntryType) => {
    setShowConfirmModal(true);
    setCurrent(record);
  };
  const handleCancel = () => {
    setShowConfirmModal(false);
    setShowCallbackModal(false);
  };
  const confirmEntry = (values: EntryType) => {
    const data = {
      id: values.id,
      txnHash: values.txnHash,
    };
    WithdrawEntryService.confirm(data).then(res => {
      antdMessage.success('手動認款成功');
      setShowConfirmModal(false);
      actionRef.current?.reload();
    }).catch(err => {
      antdMessage.error('手動認款失敗');
      console.log(err);
    });
  };
  const openCallbackEntryModal = (record: EntryType) => {
    setShowCallbackModal(true);
    setCurrent(record);
  };
  const callbackEntry = (values: EntryType) => {
    WithdrawEntryService.callback(values.id).then(res => {
      antdMessage.success('推入回調queue成功');
      setShowCallbackModal(false);
      actionRef.current?.reload();
    }).catch(err => {
      antdMessage.error('推入回調queue失敗');
      console.log(err);
    });
  };

  const searchColumns: ProColumns<EntryType>[] = [
    {
      title: '訂單號',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '加密貨幣別',
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
      title: '建單時間',
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
      title: '狀態',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        isCompleted: { text: '成功且回調' },
        isConfirmed: { text: '成功' },
        isProcess: { text: '處理中' },
        isFailed: { text: '失敗' },
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
      title: '訂單號',
      dataIndex: 'id',
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '匯率',
      dataIndex: 'rate',
      hideInSearch: true,
    },
    {
      title: '金額(人民幣)',
      dataIndex: 'amount',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0');
      },
    },
    {
      title: '手續費',
      dataIndex: 'fee',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0.000000');
      },
    },
    {
      title: '加密貨幣別',
      hideInSearch: true,
      render: (text, record, _, action) =>
        <>{record.currency.name}</>,
    },
    {
      title: '出款至',
      hideInSearch: true,
      render: (text, record, _, action) =>
        <>{record.toAddress}</>,
    },
    {
      title: '加密貨幣金額',
      dataIndex: 'cryptoAmount',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0.000000');
      },
    },
    {
      title: '實際出款金額',
      dataIndex: 'realCryptoAmount',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0.000000');
      },
    },
    {
      title: '建單時間',
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
      title: '狀態',
      valueType: 'option',
      render: (text, record, _, action) => {
        const { isProcess, isConfirmed, isCompleted, isFailed } = record;
        if (isFailed) {
          return '失敗';
        }
        if (isCompleted) {
          return '成功且回調';
        }
        if (isConfirmed) {
          return '成功';
        }
        return '處理中';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="1"
              onClick={() => openConfirmEntryModal(record)}
              disabled={record.isConfirmed || record.isFailed}
            >
              手動認款
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => openCallbackEntryModal(record)}
              disabled={record.isCompleted || record.isProcess}
            >
              手動回調
            </Menu.Item>
          </Menu>
        );

        return <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            動作
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
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <PageContainer>
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
          headerTitle="訂單列表"
        />
      </div>
      {showConfirmModal && <ConfirmModal
        done={false}
        current={current}
        onCancel={handleCancel}
        onSubmit={confirmEntry}
      />}
      {showCallbackModal && <CallbackModal
        done={false}
        current={current}
        onCancel={handleCancel}
        onSubmit={callbackEntry}
      />}
    </PageContainer>
  );
}
