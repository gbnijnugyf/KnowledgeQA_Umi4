import { setBaseUrl } from '@/action';
import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';
import { Provider, connect } from 'react-redux';
import store from '../store';

const NoFoundPage: React.FC = () => (
    <Result
      status="404"
      title="404"
      subTitle="pages.404.subTitle"
      extra={
        <>
          <Button type="primary" onClick={() => history.push('/welcome')}>
            点击重新加载
          </Button>
          {/* <input
            onChange={(e) => console.log(e.target.value)}
            placeholder="eg:http://10.79.183.86:5000"
          /> */}
        </>
      }
    />
);
// const mapDispatchToProps = {
//   setBaseUrl:setBaseUrl,
// };

// export default connect(null, mapDispatchToProps)(NoFoundPage);
export default NoFoundPage;
