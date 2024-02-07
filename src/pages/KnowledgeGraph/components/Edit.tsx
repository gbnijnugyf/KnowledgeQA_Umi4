import { Button, Form, Input, InputNumber, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { SelectNodeType } from '..';
import { dNode } from './Graph';

export function Edit(props: { node: SelectNodeType }) {
  const [data, setData] = useState<Item[]>([]);
  useEffect(() => {
    // 获取数据
    const dataTemp: Item[] = props.node.links.map((link) => {
      const tNode: dNode = link.target.id === props.node.sNode.id ? link.source : link.target;
      return {
        key: tNode.id.toString(),
        tNode: tNode.name,
        link: link.name || '暂无描述',
      };
    });
    flushSync(() => {
      setData(dataTemp);
    });
  }, [props]);

  return (
    <div style={{ marginLeft: '1vw', borderLeft: '1px dashed gray', height: '100%' }}>
      <h2>节点信息</h2>
      <div>
        {/* <h3>节点信息</h3> */}
        <p>节点名称: {props.node.sNode.name} </p>
        {/* <h3>边信息</h3>
        {props.node.links.map((link) => (
          <div key={link.target.id}>
            <div>目标节点: {link.target.name}</div>
            <div>边权重: {link.weight}</div>
          </div>
        ))}
        <h3>相邻节点信息</h3>
        {props.node.tNodes.map((node) => (
          <div>123</div>
        ))} */}
        <NodeEdit data={data} />
      </div>
    </div>
  );
}

interface Item {
  key: string;
  tNode: string;
  link: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 8 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
function NodeEdit(props: {
  data: Item[];
  // setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  // display: boolean;
  // successFunc: (text?: string) => void;
  // failFunc: (text?: string) => void;
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [oldName, setOldName] = useState<string>('');
  useEffect(() => {
    console.log(props.data);
    flushSync(() => {
      setData(props.data);
    });
  }, [props]);

  const handleAddLink = () => {
    // const newData = {
    //   key: '0',
    //   tNode: '0',
    //   link: '0',
    // };
    // setData([...data, newData]);
    // setEditingKey('0');
  }

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    console.log(record);
    setOldName(record.key);
    form.setFieldsValue({ classname: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  const handleDelete = (key: React.Key) => {
    console.log(key.toString());
  };

  const save = async (key: React.Key) => {
    console.log(key);
    try {
      //索引key就是classname，classname唯一
      const row = (await form.validateFields()) as Item; //as key实际上不包含key，即没有索引值,从这获取更新值
      let newData = [...data]; //此时能拿到更新值，但根据索引找到对应行后不是更新值，通过row修改
      const index = newData.findIndex((item) => key === item.key);
      //通过row修改，使其真正的是newData
      newData[index].key = row.tNode;
      newData[index].tNode = row.tNode;
      newData[index].link = row.link;
      if (index > -1) {
        const item = newData[index];
        console.log(item);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '相邻节点',
      dataIndex: 'tNode',
      width: '25%',
      editable: true,
    },
    {
      title: '边',
      dataIndex: 'link',
      width: '50%',
      editable: true,
    },
    // {
    //   title: "operation",
    //   dataIndex: "operation",
    //   render: (_: any, record: Item) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <span>
    //         <Typography.Link
    //           onClick={() => save(record.key)}
    //           style={{ marginRight: 8 }}
    //         >
    //           Save
    //         </Typography.Link>
    //         <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
    //           <div>Cancel</div>
    //         </Popconfirm>
    //       </span>
    //     ) : (
    //       <Typography.Link
    //         disabled={editingKey !== ""}
    //         onClick={() => edit(record)}
    //       >
    //         Edit
    //       </Typography.Link>
    //     );
    //   },
    // },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: { key: React.Key }) =>
        data.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <div style={{cursor:'pointer'}}>删除边关系</div>
          </Popconfirm>
        ) : null,
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Button onClick={handleAddLink}>添加边关系</Button>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            pageSize: 5,
          }}
        />
      </Form>
    </>
  );
}
