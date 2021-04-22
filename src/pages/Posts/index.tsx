import React from 'react';
import ProLayout, { PageContainer, SettingDrawer } from '@ant-design/pro-layout';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import request from 'umi-request';
import { Card } from 'antd';

const Posts: React.FC = () => {
  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '标题',
      dataIndex: 'title',
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
      title: '发帖人',
      dataIndex: 'creator_id',
    },
    {
      title: '分类',
      dataIndex: 'tag',
    },
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
      hideInSearch: true,
      valueType: 'date',
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
        record.status === 0 ? <a>通过</a> : null,
        record.status === 0 ? <a>拒绝</a> : null,
      ],
    },
  ];

  return (
    <PageContainer waterMarkProps={undefined}>
      <ProTable
        columns={columns}
        rowKey="id"
        request={async (params = { pageSize: 10, current: 1 }) =>
          request('http://localhost:3001/admin/allPost', {
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

export default Posts;
