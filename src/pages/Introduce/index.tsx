// import { useNavigate } from '@umijs/max';
// import { Button } from 'antd';
import { Button } from 'antd';
import backgroundVideo from '../../../public/loginBg.mp4';
import backgroundImg from '../../../public/loginBgImg.jpg';
import './index.scss';

// const IntroduceBackground = () => {
//   const navigate = useNavigate();
//   return (
//     <>
//       <video
//         autoPlay // 自动播放
//         loop // 循环播放
//         muted // 视频静音
//         src={background}
//         style={{
//           position: 'fixed',
//           width: '100%',
//           // height:'100%',
//           zIndex: '-100',
//         }}
//       ></video>
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           paddingTop: '10%',
//         }}
//       >
//         <h1 style={{ color: 'white', fontSize: '500%', fontFamily: 'serif' }}>智学导图</h1>
//         <Button className="try-btn" onClick={() => navigate('/welcome')}>
//           立即体验
//         </Button>
//       </div>
//     </>
//   );
// };

// export default IntroduceBackground;

import ReactFullpage from '@fullpage/react-fullpage';
import { useNavigate } from '@umijs/max';
import { DownOutlined } from '@ant-design/icons';

const IntroduceBackground = () => {
  const navigate = useNavigate();
  // let footerText = document.querySelector(".fp-watermark")
  // footerText =
  return (
    <ReactFullpage
      //fullpage options
      licenseKey={'YOUR_KEY_HERE'}
      scrollingSpeed={1000} /* Options here */
      credits={{}}
      render={({ state, fullpageApi }) => {
        return (
          <ReactFullpage.Wrapper>
            <div className="section" id="section1">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: '7%',
                }}
              >
                <h1 style={{ color: 'white', fontSize: '500%', fontFamily: 'serif' }}>智学导图</h1>
                <Button className="try-btn" onClick={() => navigate('/welcome')}>
                  立即体验
                </Button>
                <div style={{color:'white',marginTop:"5%",opacity:'0.6'}}>下滑查看更多<DownOutlined /></div>
              </div>
            </div>
            <div className="section">
              <video
                controls
                width="70%"
                autoPlay
                loop
                style={{
                  marginLeft: '15%',
                  borderRadius: '15px',
                }}
              >
                <source src={backgroundVideo} type="video/mp4" />
              </video>
              {/* <div style={{
                // border:'10px red solid',
                position:'fixed',
                width:'100%',
                height:'7%',
                left:'0%',
                bottom:'-100%',
                backgroundColor:'white',
                zIndex:'999999'
                // right:0,
                // bottom:0
              }}></div> */}
            </div>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  );
};
export default IntroduceBackground;

// ReactDOM.render(<IntroduceBackground />, document.getElementById('react-root'));
