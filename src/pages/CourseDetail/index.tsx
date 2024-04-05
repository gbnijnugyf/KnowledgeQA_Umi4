import { getStudentsList, myGetCourse } from '@/services/ant-design-pro/api';
import { PageContainer, ProList } from '@ant-design/pro-components';
import { Breadcrumb, Card, Modal, Space, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useParams } from 'umi';
import DetailDrawer from '../TableList/components/DetailDrawer';
import './index.scss';
export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<API.KnowledgeBaseListItem>();
  //   const [courseFiles, setCourseFiles] = useState<API.KnowledgeBaseFileListItem[]>();
  const breadItems = [
    { path: '/admin', title: '管理页' },
    { path: '/knowledgeBase', title: '课程管理' },
    { path: `/${courseId}`, title: '课程详情' },
  ];
  useEffect(() => {
    if (courseId !== undefined) {
      myGetCourse({ key: parseInt(courseId) }).then((res) => {
        if (res.status === 1) {
          flushSync(() => {
            setCourse(res.data);
          });
          // console.log(course)
        } else {
          message.error('获取课程失败');
        }
      });
    }
  }, [courseId]);

  return (
    <PageContainer
      //虽然这个写法很奇怪，但别改，有bug
      header={{
        title: <Breadcrumb style={{}} items={breadItems} />,
      }}
      breadcrumb={{}}
    >
      <div style={{ width: '100%' }}>
        {course !== undefined ? (
          <Card style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
            <CourseTitle courseInfo={course} />
          </Card>
        ) : (
          <>该课程已不可见</>
        )}
      </div>
      <DetailDrawer key_id={course?.key||-1} baseName={course?.name || ''} />
    </PageContainer>
  );
}

function CourseTitle(props: { courseInfo: API.KnowledgeBaseListItem }) {
  const [dataSource, setDataSource] = useState<API.KnowledgeBaseListItem[]>([props.courseInfo]);
  const [studentsModalOpen, setStudentsModalOpen] = useState<boolean>(false);
  const [studentsList, setStudentsList] = useState<API.StudentInfo[]>([]);

  const readStudentsList = async () => {
    const res = await getStudentsList({ key: props.courseInfo.key || -1 });
    if (res.status === 1) {
      setStudentsList(res.data);
      setStudentsModalOpen(true);
    } else {
      message.error('获取学生列表失败');
    }
  };

  return (
    <>
      <ProList<API.KnowledgeBaseListItem>
        rowKey="id"
        headerTitle={props.courseInfo.name}
        dataSource={dataSource}
        showActions="hover"
        editable={{
          onSave: async (key, record, originRow) => {
            // console.log(key, record, originRow);
            return true;
          },
        }}
        onDataSourceChange={setDataSource}
        metas={{
          // title: {
          //   dataIndex: 'name',
          // },
          description: {
            dataIndex: 'desc',
          },
          subTitle: {
            render: () => {
              return (
                <Space size={0}>
                  <Tag color="blue">{props.courseInfo.owner}</Tag>
                  <Tag color="#5BD8A6">{props.courseInfo.createdAt}</Tag>
                </Space>
              );
            },
          },
          actions: {
            render: (text, row, index, action) => [<a onClick={readStudentsList}>查看学生列表</a>],
          },
        }}
      />
      <Modal
        open={studentsModalOpen}
        onCancel={() => {
          setStudentsModalOpen(false);
        }}
        footer={[]}
        style={{ width: '35vw', maxHeight: '50vh' }}
      >
        <ProList<API.StudentInfo>
          style={{ maxHeight: '47vh', overflowY: 'scroll', marginRight: '5%' }}
          rowKey="id"
          headerTitle={<div>《{props.courseInfo.name}》学生列表</div>}
          dataSource={studentsList}
          showActions="hover"
          onDataSourceChange={setStudentsList}
          metas={{
            title: {
              dataIndex: 'name',
            },
          }}
        />
      </Modal>
    </>
  );
}
