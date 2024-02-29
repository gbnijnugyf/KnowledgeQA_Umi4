import { myGetCourses } from '@/services/ant-design-pro/api';
import { SearchOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd/es/select';
import { Select } from 'antd/lib';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

function fetch(value: string, callback: Function) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  const fake = () => {
    myGetCourses({ option: 3, word: value }).then((res) => {
      if (currentValue === value) {
        const data = res.data;
        const dataArr = data.map((item: API.KnowledgeBaseListItem) => {
          return item;
        });
        callback(dataArr);
      }
    });
  };
  if (value) {
    timeout = setTimeout(fake, 300);
  } else {
    callback([]);
  }
}

const SearchInput: React.FC<{
  placeholder: string;
  style: React.CSSProperties;
  onSeleted: (course: API.KnowledgeBaseListItem) => void;
}> = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState<SelectProps['options']>([]);
  const [value, setValue] = useState<API.KnowledgeBaseListItem>();

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData);
  };

  const handleChange = (value: number) => {
    const selectedCourse: API.KnowledgeBaseListItem | undefined = data?.find(
      (course: API.KnowledgeBaseListItem) => course.key === value,
    );
    if (selectedCourse !== undefined) {
      console.log(selectedCourse);
      props.onSeleted(selectedCourse);
    }

    if (selectedCourse !== undefined) {
      console.log(selectedCourse);
      props.onSeleted(selectedCourse);
    }
  };

  return (
    <Select
      showSearch
      value={value?.key}
      placeholder={'搜索课程'}
      style={props.style}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={<div>找不到相关信息</div>}
      allowClear={true}
      loading={true}
      options={(data || []).map((d: API.KnowledgeBaseListItem) => {
        return {
          value: d.key,
          label: d.name,
        };
      })}
    />
  );
};
interface ISearch {
  myOnSeleted: (course: API.KnowledgeBaseListItem) => void;
}
export function Search(props: ISearch) {
  return (
    <>
      <SearchInput
        onSeleted={props.myOnSeleted}
        placeholder="input search text"
        style={{ width: 200 }}
      />
      <SearchOutlined />
    </>
  );
}
