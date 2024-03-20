import { useNavigate } from '@umijs/max';
import { Button } from 'antd';
import background from '../../../public/loginBg.mp4';
import './index.scss';

const IntroduceBackground = () => {
  const navigate = useNavigate();
  return (
    <>
      <video
        autoPlay // 自动播放
        loop // 循环播放
        muted // 视频静音
        src={background}
        style={{
          position: 'fixed',
          width: '100%',
          // height:'100%',
          zIndex: '-100',
        }}
      ></video>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '10%',
        }}
      >
        <h1 style={{ color: 'white', fontSize: '500%', fontFamily: 'serif' }}>智学导图</h1>
        <Button className="try-btn" onClick={() => navigate('/welcome')}>
          立即体验
        </Button>
      </div>
    </>
  );
};

export default IntroduceBackground;
