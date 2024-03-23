import { Carousel, message } from 'antd';
import { useEffect, useState } from 'react';
import { CardArrayItem } from './CourseCard';
import { myGetCourses } from '@/services/ant-design-pro/api';
import { convertTo2DArray } from '@/services/plugin/utils';
import "./CourseForm.scss"
import { useAccess } from '@umijs/max';

interface ICourseForm {
  myOnClick:(course:API.KnowledgeBaseListItem)=>void
}

export function CourseForm(props:ICourseForm) {
  const [cardArr, setCardArr] = useState<API.KnowledgeBaseListItem[][]>([]);
  const aPageNum = useAccess().isMobile()? 3:5
  useEffect(() => {
    myGetCourses({ option: 1 }).then((res) => {
        if(res.status===1){
            const courseArray = convertTo2DArray<API.KnowledgeBaseListItem>(res.data,aPageNum)
            setCardArr(courseArray)
        }else{
            message.error('获取课程列表失败')
        }
    })
  }, [location]);
  return (
    <div>
    <Carousel className="my-carousel" autoplay={false} dotPosition={'bottom'}>
      {cardArr.length > 0 ? (
        cardArr.map((pageArr) => {
          return (
            <>
              <CardArrayItem myOnClick={props.myOnClick} list={pageArr} />
            </>
          );
        })
      ) : (
        <p>暂无可见课程</p>
      )}
    </Carousel></div>
  );
}
