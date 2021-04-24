import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Descriptions,
  Result,
  Avatar,
  Space,
  Statistic,
  Card,
  List,
  message,
  Image,
} from 'antd';
import request from 'umi-request';
import { PREFIX } from '@/utils/utils';

const PostDetail: React.FC = (props) => {
  const { match } = props as any;
  const [postInfo, setPostInfo] = useState<any>();

  const [applyList, setApplyList] = useState();
  const [memberList, setMemberList] = useState([]);
  const [rejectList, setRejectList] = useState([]);

  const [tab, setTab] = useState('info');
  const [urlList, setUrlList] = useState([]);

  const tabEnum = {
    participant: memberList,
    applicant: applyList,
    reject: rejectList,
  };

  const statusEnum = {
    0: '待审核',
    1: '审核通过',
    2: '已满员',
    3: '已完成',
    99: '审核拒绝',
  };

  useEffect(() => {
    const getPost = async () => {
      const res = await request(`http://localhost:3001/post/${match.params.id}`);
      if (res.errno === 0) {
        console.log(res.data);
        setPostInfo(res.data);
        if (res.data.images) {
          const list = res.data.images.split('&').map((item: any) => {
            return `${PREFIX}${item}`;
          });
          console.log(list);
          setUrlList(list);
        }
      }
    };
    getPost();
  }, []);

  useEffect(() => {
    const getMembers = async () => {
      const res = await request(`http://localhost:3001/post/apply/list/${match.params.id}`);
      if (res.errno === 0) {
        const list = res.data;
        setApplyList(list.filter((item: any) => item.is_accept === 0));
        setMemberList(list.filter((item: any) => item.is_accept === 1));
        setRejectList(list.filter((item: any) => item.is_accept === 2));
      }
    };
    getMembers();
  }, []);

  const content = (
    <Descriptions size="small" column={2}>
      <Descriptions.Item label="创建人">{postInfo?.user?.username}</Descriptions.Item>
      <Descriptions.Item label="联系方式">{postInfo?.user.phone}</Descriptions.Item>
      <Descriptions.Item label="创建时间">
        {new Date(postInfo?.createdAt).toLocaleDateString()}
      </Descriptions.Item>
      <Descriptions.Item label="更新时间">
        {new Date(postInfo?.updatedAt).toLocaleDateString()}
      </Descriptions.Item>
      <Descriptions.Item label="位置">{postInfo?.user?.location}</Descriptions.Item>
      <Descriptions.Item label="状态">{statusEnum[postInfo?.status]}</Descriptions.Item>
    </Descriptions>
  );

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
      setPostInfo({
        ...postInfo,
        status: isApprove ? 1 : 99,
      });
    }
  };

  return (
    <PageContainer
      content={content}
      title={postInfo?.title}
      tabActiveKey={tab}
      onTabChange={(tab) => setTab(tab)}
      tabList={[
        {
          tab: '内容',
          key: 'info',
        },
        {
          tab: '参与者',
          key: 'participant',
        },
        {
          tab: '正在申请',
          key: 'applicant',
        },
        {
          tab: '已拒绝',
          key: 'reject',
        },
      ]}
      extraContent={
        <Space size={10}>
          <Statistic
            title="参与人数"
            value={memberList?.length}
            suffix={`/${postInfo?.maxMembers}`}
            style={{ marginRight: 150 }}
          />
        </Space>
      }
      extra={
        postInfo?.status === 0
          ? [
              <Button type="primary" onClick={() => audit(postInfo.id, true)}>
                审核通过
              </Button>,
              <Button onClick={() => audit(postInfo.id, false)}>审核拒绝</Button>,
            ]
          : null
      }
    >
      {tab == 'info' ? (
        <Card>
          <p>{postInfo?.content}</p>
          <div style={{ textAlign: 'center' }}>
            {urlList.map((item) => {
              return <Image src={item} width={'80%'} style={{ marginTop: '40px' }} />;
            })}
          </div>
        </Card>
      ) : (
        <Card title="人员列表">
          <List
            itemLayout="horizontal"
            dataSource={tabEnum[tab]}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`${PREFIX}${item?.user?.avatar}`} />}
                  title={<a href="https://ant.design">{item?.user?.username}</a>}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </PageContainer>
  );
};

export default PostDetail;
