import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { AuthService } from '@/service/auth.service';
import { TokenService } from '@/service/token.service';
import { history } from '@@/core/history';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { MerchantService } from '@/service/merchant.service';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import EditModal from '@/pages/merchant/components/EditModal';
import { MerchantType } from '@/pages/merchant/data';

export default function Merchant() {
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [current, setCurrent] = useState<MerchantType | undefined>();
  const actionRef = useRef<ActionType>();

  const openEditModal = (record: MerchantType) => {
    setCurrent(record);
    setShowEditModal(true);
  };

  const handleCancel = () => {
    setShowEditModal(false);
  };

  const handleSubmit = (values: MerchantType) => {
    MerchantService.edit(values.id, values).then(res => {
      setShowEditModal(false);
      actionRef.current?.reload();
    }).catch(err => {
      // todo dispatch global error;
      console.log(err);
      setShowEditModal(false);
    });
  };

  const columns: ProColumns<MerchantType>[] = [
    {
      title: '商號id',
      dataIndex: 'id',
    },
    {
      title: '商號',
      dataIndex: 'number',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '最小入款金額',
      dataIndex: 'minPerDeposit',
      hideInSearch: true,
    },
    {
      title: '最大入款金額',
      dataIndex: 'maxPerDeposit',
      hideInSearch: true,
    },
    {
      title: '最小出款金額',
      dataIndex: 'minPerWithdraw',
      hideInSearch: true,
    },
    {
      title: '最大出款金額',
      dataIndex: 'maxPerWithdraw',
      hideInSearch: true,
    },
    {
      title: '入款手續費(%)',
      dataIndex: 'feePercent',
      hideInSearch: true,
    },
    {
      title: '出款手續費(%)',
      dataIndex: 'withdrawFeePercent',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => openEditModal(record)}
        >
          编辑
        </a>,
        <a
          key="editable"
          onClick={() => {
            console.log('from delete button');
          }}
        >
          刪除
        </a>,
      ],
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
        <ProTable<MerchantType>
          columns={columns}
          actionRef={actionRef}
          request={async (params = {}, sort, filter) => {
            // todo 如果有多個商號再來寫params
            const merchants = await MerchantService.getList(params);
            return { data: merchants };
          }}
          rowKey="id"
          search={{ labelWidth: 'auto' }}
          // form={{
          //   // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          //   syncToUrl: (values, type) => {
          //     if (type === 'get') {
          //       return {
          //         ...values,
          //         created_at: [values.startTime, values.endTime],
          //       };
          //     }
          //     return values;
          //   },
          // }}
          pagination={{
            pageSize: 20,
          }}
          dateFormatter="string"
          headerTitle="商號列表"
          toolBarRender={() => [
            // <Button key="button" icon={<PlusOutlined/>} type="primary">
            //   新建
            // </Button>,
          ]}
        />
      </div>
      {showEditModal && <EditModal
        done={false}
        current={current}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />}
    </PageContainer>
  );
}
