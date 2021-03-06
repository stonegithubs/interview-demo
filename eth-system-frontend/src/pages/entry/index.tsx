import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { AuthService } from '@/service/auth.service';
import { TokenService } from '@/service/token.service';
import { history } from '@@/core/history';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { EntryType } from '@/pages/entry/data';
import { EntryService } from '@/service/entry.service';
import numeral from 'numeral';
import { Dropdown, Menu, message as antdMessage } from 'antd';
import ConfirmModal from '@/pages/entry/components/ConfirmModal';
import CallbackModal from '@/pages/entry/components/CallbackModal';

export default function Entry() {
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
    return await EntryService.getList(p);
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
      fromAddress: values.fromAddress,
      txnHash: values.txnHash,
    };
    EntryService.confirm(data).then(res => {
      antdMessage.success('??????????????????');
      setShowConfirmModal(false);
      actionRef.current?.reload();
    }).catch(err => {
      antdMessage.error('??????????????????');
      console.log(err);
    });
  };
  const openCallbackEntryModal = (record: EntryType) => {
    setShowCallbackModal(true);
    setCurrent(record);
  };
  const callbackEntry = (values: EntryType) => {
    EntryService.callback(values.id).then(res => {
      antdMessage.success('????????????queue??????');
      setShowCallbackModal(false);
      actionRef.current?.reload();
    }).catch(err => {
      antdMessage.error('????????????queue??????');
      console.log(err);
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
        isCompleted: { text: '???????????????' },
        isConfirmed: { text: '??????' },
        isProcess: { text: '?????????' },
        isFailed: { text: '??????' },
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
      title: '??????',
      dataIndex: 'rate',
      hideInSearch: true,
    },
    {
      title: '??????(?????????)',
      dataIndex: 'amount',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0');
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
      title: '??????????????????',
      dataIndex: 'realCryptoAmount',
      hideInSearch: true,
      renderText: (text) => {
        return numeral(text).format('0,0.000000');
      },
    },
    {
      title: '????????????',
      dataIndex: 'randomAmount',
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
      title: '??????',
      valueType: 'option',
      render: (text, record, _, action) => {
        const { isProcess, isConfirmed, isCompleted, isFailed } = record;
        if (isFailed) {
          return '??????';
        }
        if (isCompleted) {
          return '???????????????';
        }
        if (isConfirmed) {
          return '??????';
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
            <Menu.Item
              key="2"
              onClick={() => openCallbackEntryModal(record)}
              disabled={record.isCompleted || record.isProcess}
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
          headerTitle="????????????"
          // toolBarRender={() => [
          //   <Button key="button" icon={<PlusOutlined/>} type="primary">
          //     ??????
          //   </Button>,
          // ]}
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
