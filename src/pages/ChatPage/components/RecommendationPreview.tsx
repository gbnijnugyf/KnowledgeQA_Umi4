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
