import React from 'react';
import ProLayout, { PageContainer, SettingDrawer } from '@ant-design/pro-layout';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import request from 'umi-request';
import { message } from 'antd';
import { Link } from 'react-router-dom';

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
      dataIndex: 'username',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: '待审核',
        1: '审核通过',
        2: '已满员',
        3: '已完成',
        99: '审核拒绝',
      },
      width: 100,
    },

    {
      title: '分类',
      dataIndex: 'tag',
      valueEnum: {
        代拿快递: '代拿快递',
        超市代购: '超市代购',
        拼车出行: '拼车出行',
        活动积赞: '活动积赞',
      },
      width: 100,
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
        <Link to={`/post/${record.id}`}>查看</Link>,
        record.status === 0 ? (
          <a
            onClick={async () => {
              await audit(record.id, true);
              action?.reload();
            }}
          >
            通过
          </a>
        ) : null,
        record.status === 0 ? (
          <a
            onClick={async () => {
              await audit(record.id, false);
              action?.reload();
            }}
          >
            拒绝
          </a>
        ) : null,
      ],
    },
  ];

  const audit = async (postId: number, isApprove: boolean) => {
    const res = await request('http://localhost:3001/admin/audit', {
      method: 'POST',
      data: {
        postId,
        isApprove,
      },
    });
    if (res.errno === 0) {
      message.success('审批成功');
    }
  };

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
        pagination={{
          pageSize: 10,
        }}
      ></ProTable>
    </PageContainer>
  );
};

export default Posts;
