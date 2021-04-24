import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2021 brsmsg"
    links={[
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/brsmsg',
        blankTarget: true,
      },
    ]}
  />
);
