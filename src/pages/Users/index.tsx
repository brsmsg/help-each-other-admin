import React from 'react';
import ProLayout, { PageContainer, SettingDrawer } from '@ant-design/pro-layout';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import request from 'umi-request';
import { Card } from 'antd';

const Users: React.FC = () => {
  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      ellipsis: true,
      tip: '标题过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        0: '男',
        1: '女',
      },
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'state',
    //   filters: true,
    //   onFilter: true,
    //   valueType: 'select',
    //   valueEnum: {
    //     all: { text: '全部', status: 'Default' },
    //     open: {
    //       text: '未解决',
    //       status: 'Error',
    //     },
    //     closed: {
    //       text: '已解决',
    //       status: 'Success',
    //       disabled: true,
    //     },
    //     processing: {
    //       text: '解决中',
    //       status: 'Processing',
    //     },
    //   },
    // },
    // {
    //   title: '标签',
    //   dataIndex: 'labels',
    //   search: false,
    //   renderFormItem: (_, { defaultRender }) => {
    //     return defaultRender(_);
    //   },
    //   render: (_, record) => (
    //     <Space>
    //       {record.labels.map(({ name, color }) => (
    //         <Tag color={color} key={name}>
    //           {name}
    //         </Tag>
    //       ))}
    //     </Space>
    //   ),
    // },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createdAt',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '位置',
      dataIndex: 'location',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            console.log(record.id);
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
      ],
    },
  ];

  return (
    <PageContainer waterMarkProps={undefined}>
      <ProTable
        columns={columns}
        rowKey="id"
        request={async (params = { pageSize: 10, current: 1 }) =>
          request('http://localhost:3001/admin/allUser', {
            params,
          })
        }
        editable={{
          type: 'multiple',
        }}
      ></ProTable>
    </PageContainer>
  );
};

export default Users;
