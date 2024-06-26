import { getRecommend } from '@/services/ant-design-pro/api';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Tag } from 'antd';
import { useState } from 'react';
import '../index.scss';
// 定义 RecommendationPreview 组件的 props 类型
interface RecommendationPreviewProps {
  selectedRecommendation: string;
  handleHidePreview: () => void;
}

// RecommendationPreview 组件
export function RecommendationPreview({
  selectedRecommendation,
  handleHidePreview,
}: RecommendationPreviewProps) {
  return (
    <>
      {/* 在这里展示预览的文件 */}
      {/* TODO：ifame仅可展示pdf、txt格式，但后端可将ppt转为pdf */}
      <iframe
        width="100%"
        height="100%"
        src="http://localhost:8001/static/files/知识图谱融合大模型.pdf"
        // src="http://localhost:8001/static/files/1.pptx"
        // src="http://localhost:8001/static/files/2.csv"
        // src="http://localhost:8001/static/files/3.txt"
        // src="http://localhost:8001/static/files/4.doc"
        // src="http://localhost:8001/static/files/5.ppt"
      ></iframe>
    </>
  );
}

interface IRecommendationCardProps {
  item: API.MessageType;
  base_key: number[];
}

export function RecommendationCard(props: IRecommendationCardProps) {
  const [recommendTextBoxOpen, setRecommendTextBoxOpen] = useState<boolean>(false);
  const [recommendText, setRecommendText] = useState<string>('正在加载，首次加载所需时间较长');
  const [recommendTag, setRecommendTag] = useState<string>('');
  const tagColors = ['#C0B4FA', '#86B6F6'];

  const handleClickTag = (name: any) => {
    // console.log(name);
    setRecommendTag(name);
    setRecommendText('正在加载，首次加载所需时间较长');
    setRecommendTextBoxOpen(true);
    getRecommend(props.base_key, name).then((res)=>{
      if(res.status===1){
        setRecommendText(res.data);
        // setRecommendTextBoxOpen(true);
      }
    });
  };
  return (
    <>
      {props.item.recommend?.length !== undefined && props.item.recommend?.length > 0 && (
        <Card
          id="shadow-box"
          className="recommendation-card"
          style={{ backgroundColor: '#EEF5FF', border: '#BFBFBF 1px solid' }}
        >
          {/* {props.item.recommend?.length !== undefined && props.item.recommend?.length>0 && ( */}
          <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
            您可能还想了解：
            {props.item.recommend && (
              <>
                {props.item.recommend.map((recommendation: string, index) => (
                  <Tag
                    className="recommend-list"
                    onClick={() => handleClickTag(recommendation)}
                    color={tagColors[index % 2]}
                    style={{ color: 'white' }}
                  >
                    <div
                      style={{
                        // borderRight: '0.5px solid #ccc',
                        paddingRight: '0.5em',
                      }}
                    >
                      {index + 1}
                    </div>
                    {recommendation}
                  </Tag>
                ))}
              </>
            )}
          </div>
          {/* )} */}
        </Card>
      )}
      {recommendTextBoxOpen && (
        <Card
          className="recommendation-card"
          id="shadow-box"
          style={{ marginTop: '0.3em', border: '#BFBFBF 1px solid' }}
          title={
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
            >
              <div style={{ width: '80%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {recommendTag}
              </div>
              <Button
                onClick={() => {
                  setRecommendTextBoxOpen(false);
                }}
                style={{ border: 'none' }}
                icon={<CloseOutlined />}
              />
            </div>
          }
        >
          <div style={{ width: '100%', flexWrap: 'wrap' }}>{recommendText}</div>
        </Card>
      )}
    </>
  );
}
