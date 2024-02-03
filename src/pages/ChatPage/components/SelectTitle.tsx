import { myGetKnowledgeBaseListPart } from '@/services/ant-design-pro/api';
import { Select } from 'antd';
import { useEffect, useState } from 'react';

type IOption = {
  value: string;
  label: string;
};
interface ISelectTtileProps {
  setKey: React.Dispatch<React.SetStateAction<number>>;
}
export function SelectTtile(props: ISelectTtileProps) {
  const [options, setOptions] = useState<IOption[] | undefined>([]);

  useEffect(() => {
    myGetKnowledgeBaseListPart().then((res) => {
      console.log(res);
      const data: IOption[] | undefined = res.data.data?.map((item) => {
        const temp: IOption = {
          value: item.key?.toString() as string,
          label: item.name as string,
        };
        return temp;
      });
      setOptions(data);
    });
  }, []);

  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="搜索"
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? '').includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      }
      onChange={(value: number) => {
        props.setKey(value);
      }}
      options={options}
      // allowClear
      // onClear={() => {
      //   flushSync(() => {
      //     props.setKey(-1);
      //   });
      // }}
    />
  );
}
