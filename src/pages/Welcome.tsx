import { PageContainer } from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Card, message, theme } from 'antd';
import React, { useState } from 'react';
import welComeBg from '../../public/welcomeBg.jpg';
import { AddCourseDialog } from './Course/components/AddCourseDialog';
import { CourseForm } from './Course/components/CourseForm';
import { Search } from './Course/components/SearchCourse';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        了解更多 {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const access = useAccess();
  const [course, setCourse] = useState<API.KnowledgeBaseListItem>();
  const [addCourseModal, setAddCourseModal] = useState<boolean>(false);
  const [flush, setFlush] = useState<boolean>(false);
  const myOnClick = (course: API.KnowledgeBaseListItem) => {
    if (access.adminRoute()) {
      message.warning('教师暂不支持添加课程');
    } else {
      setCourse(course);
      setAddCourseModal(true);
    }
  };
  const backgroundImg = access.isMobile() ? undefined : `url(${welComeBg})`;
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
      >
        <div
          style={{
            backgroundPosition: '95% -13%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '250px auto',
            backgroundImage: backgroundImg,
          }}
        >
          <div
            style={{
              fontSize: '150%',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用 智学导图
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            智学导图是一个整合了知识图谱和生成式模型的教学问答应用。
            致力于在现有问答模型的基础上，结合知识图谱，提高用户使用AI问答体验。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="https://baike.baidu.com/item/%E9%97%AE%E7%AD%94%E7%B3%BB%E7%BB%9F/9641943"
              title="了解问答系统"
              desc="问答系统(Question Answering System, QA)是信息检索系统的一种高级形式，它能用准确、简洁的自然语言回答用户用自然语言提出的问题。"
            />
            <InfoCard
              index={2}
              title="了解知识图谱"
              href="https://zh.wikipedia.org/wiki/%E7%9F%A5%E8%AD%98%E5%9C%96%E8%AD%9C"
              desc="知识图谱（英语：Knowledge Graph），是结构化的语义知识库，用于以符号形式描述物理世界中的概念及其相互关系。"
            />
            <InfoCard index={3} title="了解我们" href="http://cst.whut.edu.cn/" desc="" />
          </div>
        </div>
        <div
          style={{
            marginTop: '5vh',
            height: access.isMobile() ? '39vh' : '35vh',
            overflow: 'auto',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '150%',
                color: token.colorTextHeading,
              }}
            >
              加入你感兴趣的课程吧！
              <Search myOnSeleted={myOnClick} />
            </div>
          </div>
          <CourseForm myOnClick={myOnClick} fresh={flush}/>
        </div>
      </Card>
      <AddCourseDialog
        open={{
          value: addCourseModal,
          set: setAddCourseModal,
        }}
        flush={{
          value:flush,
          set:setFlush
        }}
        course={course}
      />
    </PageContainer>
  );
};

export default Welcome;
