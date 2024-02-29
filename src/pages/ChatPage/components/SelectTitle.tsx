import { myGetCourses } from '@/services/ant-design-pro/api';
import { Select } from 'antd';
import { useEffect, useState } from 'react';

type IOption = {
  value: string;
  label: string;
};

/** 类型守卫：setKey和onChange属性二选一 */
interface ISelectTtilePropsBase {
  mode?: 'multiple' | 'tags' | undefined;
  width?: number;
  placeholder?: string;
}
/** T泛型可以为number或number[]*/
interface ISelectTtilePropsWithSetKey<T> extends ISelectTtilePropsBase {
  value?: T;
  setKey: React.Dispatch<React.SetStateAction<T>>;
  onChange?: never;
}

interface ISelectTtilePropsWithOnChange<T> extends ISelectTtilePropsBase {
  value?: T;
  setKey?: never;
  onChange?: (value: T) => void;
}

type ISelectTtileProps<T> = ISelectTtilePropsWithSetKey<T> | ISelectTtilePropsWithOnChange<T>;

export function SelectTtile<T extends number | Array<number>>(props: ISelectTtileProps<T>) {
  // 若两个方法都没有传入，抛出错误
  if (!('setKey' in props) && !('onChange' in props)) {
    throw new Error('SelectTtile requires either a setKey or an onChange prop');
  }

  const [options, setOptions] = useState<IOption[] | undefined>([]);

  useEffect(() => {
    myGetCourses({option:2}).then((res) => {
      console.log(res);
      const data: IOption[] | undefined = res.data.map((item) => {
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
      mode={props.mode}
      showSearch
      style={{ width: props.width ?? 200 }}
      placeholder={props.placeholder ?? '请选择课程'}
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? '').includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      }
      onChange={(value: T) => {
        if ('setKey' in props && props.setKey) {
          props.setKey(value);
        } else if ('onChange' in props && props.onChange) {
          props.onChange(value);
        }
      }}
      options={options}
    />
  );
}
