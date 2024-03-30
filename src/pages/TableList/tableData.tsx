import { IHookFunc } from '@/services/plugin/globalInter';
import { ProColumns } from '@ant-design/pro-components';
import { useAccess, useNavigate } from '@umijs/max';
import { Input, message } from 'antd';
import { stringify } from 'querystring';

interface IGetColumns<T> {
  hooks: {
    openUpdate: IHookFunc<boolean>;
    openDetail: IHookFunc<boolean>;
    setCurrentRow: IHookFunc<T | undefined>;
  };
}

export const KnowledgeBase = {
  title: '知识库',
  getColumns: (
    props: IGetColumns<API.KnowledgeBaseListItem>,
  ): ProColumns<API.KnowledgeBaseListItem>[] => {
    const navigate = useNavigate();
    const access = useAccess();
    const columns: ProColumns<API.KnowledgeBaseListItem>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        tip: '点击名称设置知识库文件',
        render: (dom, entity) => {
          // console.log(dom, entity);
          return (
            <a
              onClick={() => {
                props.hooks.setCurrentRow.set(entity);
                props.hooks.openDetail.set(true);
                navigate(`/admin/knowledgeBase/${entity.key}`);
              }}
            >
              {dom}
            </a>
          );
        },
      },
      {
        title: '可见性',
        dataIndex: 'status',
        hideInForm: true,
        onFilter: true,
        valueEnum: {
          1: {
            text: '仅可问答',
            status: 'Default',
          },
          2: {
            text: '可见知识图谱',
            status: 'Processing',
          },
          3: {
            text: '所有可见',
            status: 'Success',
          },
          0: {
            text: '全不可见',
            status: 'Error',
          },
        },
      },
      {
        title: '最近更新时间',
        sorter: true,
        dataIndex: 'updatedAt',
        valueType: 'dateTime',
        renderFormItem: (item, { defaultRender, ...rest }, form) => {
          // const status = form.getFieldValue('status');
          // if (`${status}` === '0') {
          //   return false;
          // }
          // if (`${status}` === '3') {
          //   return <Input {...rest} placeholder={'Please enter the reason for the exception!'} />;
          // }
          return defaultRender(item);
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => [
          <a
            key="config"
            onClick={() => {
              props.hooks.openUpdate.set(true);
              props.hooks.setCurrentRow.set(record);
            }}
          >
            配置基本信息
          </a>,
           <a
            key="graph"
            // href={`${record.is_solve===0?'#':'#/graph?'+stringify({ key: record.key, name: record.name })}`}
            // href={`/#/graph?${stringify({ key: record.key, name: record.name })}`}
            onClick={(e) => {
              if(record.is_solve === 0) {
                e.preventDefault();
              } else {
                console.log('access.graphAccess()', access.graphAccess());
                if(access.graphAccess()===true){
                  window.open(`/#/graph?${stringify({ key: record.key, name: record.name })}`)
                }else{
                  message.info('请到电脑端查看知识图谱');
                }
              }
            }}
            // target="_blank"
            rel="noopener noreferrer"
          >
            {'查看知识图谱'}
            {/* {record.is_solve===0?'正在生成知识图谱...':'查看知识图谱'} */}
          </a>,
        ],
      },
    ];
    return columns;
  },
};

export const KnowledgeBaseFile = {
  getColumns: (
    props: IGetColumns<API.KnowledgeBaseFileListItem>,
  ): ProColumns<API.KnowledgeBaseFileListItem>[] => {
    const columns: ProColumns<API.KnowledgeBaseFileListItem>[] = [
      {
        title: '文件名',
        dataIndex: 'name',
      },
      {
        title: '文件类型',
        dataIndex: 'type',
      },
      {
        title: '可见性',
        dataIndex: 'status',
        hideInForm: true,
        onFilter: true,
        valueEnum: {
          0: {
            text: '不可见',
            status: 'Default',
          },
          1: {
            text: '可见',
            status: 'success',
          },
        },
      },
      {
        title: '解析情况',
        dataIndex: 'is_solve',
        hideInForm: true,
        onFilter: true,
        valueEnum: {
          0: {
            text: '解析失败',
            status: 'error',
          },
          1: {
            text: '解析成功',
            status: 'success',
          },
          2: {
            text: '解析中',
            status: 'processing',
          },
        },
      },
      {
        title: '上传时间',
        sorter: true,
        dataIndex: 'uploadAt',
        valueType: 'dateTime',
        renderFormItem: (item, { defaultRender, ...rest }, form) => {
          // const status = form.getFieldValue('status');
          // if (`${status}` === '0') {
          //   return false;
          // }
          // if (`${status}` === '3') {
          //   return <Input {...rest} placeholder={'Please enter the reason for the exception!'} />;
          // }
          return defaultRender(item);
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => [
          <a
            key="config"
            onClick={() => {
              props.hooks.openUpdate.set(true);
              props.hooks.setCurrentRow.set(record);
            }}
          >
            配置基本信息
          </a>,
        ],
      },
    ];
    return columns;
  },
};
