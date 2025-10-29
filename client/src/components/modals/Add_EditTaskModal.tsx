import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import 'antd/dist/reset.css';

interface AddOrEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: { name: string; assignee: string; status: string; startDate?: string; endDate?: string; priority?: string; progress?: string }) => void;
  initialData?: { name: string; assignee: string; status: string; startDate?: string; endDate?: string; priority?: string; progress?: string };
  existingNames?: string[]; // for duplicate name validation
}

const { Option } = Select;

const statusOptions = ["To do", "In Progress", "Pending", "Done"];
const priorityOptions = ["Thấp", "Trung Bình", "Cao"];
const progressOptions = ["Đúng tiến độ", "Có rủi ro", "Trễ hạn"];

const AddOrEditTaskModal: React.FC<AddOrEditTaskModalProps> = ({ isOpen, onClose, onSubmit, initialData, existingNames = [] }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      // convert possible string dates into dayjs objects for DatePicker
      const parse = (d: unknown): Dayjs | undefined => {
        if (!d) return undefined;
        if (dayjs.isDayjs(d)) return d as Dayjs;
        const str = String(d);
        // try common formats stored in app
        const parsed = dayjs(str, ["MM/DD/YYYY", "MM - DD", "YYYY-MM-DD"], true);
        return parsed.isValid() ? parsed : undefined;
      };

      form.setFieldsValue({
        name: initialData.name,
        assignee: initialData.assignee,
        status: initialData.status,
        priority: initialData.priority ?? undefined,
        progress: initialData.progress ?? undefined,
        startDate: parse(initialData.startDate),
        endDate: parse(initialData.endDate),
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form, isOpen]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Format dates as 'MM - DD' to match mock data format
      const startDate = values.startDate && dayjs.isDayjs(values.startDate) ? (values.startDate as Dayjs).format('MM - DD') : undefined;
      const endDate = values.endDate && dayjs.isDayjs(values.endDate) ? (values.endDate as Dayjs).format('MM - DD') : undefined;
      onSubmit({
        name: values.name.trim(),
        assignee: values.assignee,
        status: values.status,
        startDate,
        endDate,
        priority: values.priority,
        progress: values.progress,
      });
      onClose();
    } catch (_err) {
      void _err;
      // validation failed; antd will show messages
    }
  };

  return (
    <Modal
      title={initialData ? 'Sửa nhiệm vụ' : 'Thêm/sửa nhiệm vụ'}
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      okText={initialData ? 'Lưu' : 'Lưu'}
      cancelText="Hủy"
      width={520}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên nhiệm vụ"
          name="name"
          rules={[
            { required: true, message: 'Tên nhiệm vụ không được để trống' },
            {
              validator: (_: unknown, value: unknown) => {
                const raw = typeof value === 'string' ? value.trim() : value ? String(value).trim() : '';
                if (!raw) return Promise.resolve();
                const duplicate = existingNames.some((n: string) => n.toLowerCase() === raw.toLowerCase());
                if (duplicate && !(initialData && initialData.name.toLowerCase() === raw.toLowerCase())) {
                  return Promise.reject(new Error('Tên nhiệm vụ đã tồn tại'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input placeholder="Nhập tên nhiệm vụ" />
        </Form.Item>

        <Form.Item label="Người phụ trách" name="assignee">
          <Input placeholder="Chọn người phụ trách" />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Chọn trạng thái nhiệm vụ' }]}> 
          <Select placeholder="Chọn trạng thái nhiệm vụ">
            {statusOptions.map(s => <Option key={s} value={s}>{s}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item label="Ngày bắt đầu" name="startDate">
          <DatePicker style={{ width: '100%' }} format={'MM/DD/YYYY'} />
        </Form.Item>

        <Form.Item label="Hạn cuối" name="endDate">
          <DatePicker style={{ width: '100%' }} format={'MM/DD/YYYY'} />
        </Form.Item>

        <Form.Item label="Độ ưu tiên" name="priority">
          <Select placeholder="Chọn độ ưu tiên">
            {priorityOptions.map(p => <Option key={p} value={p}>{p}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item label="Tiến độ" name="progress">
          <Select placeholder="Chọn tiến độ">
            {progressOptions.map(p => <Option key={p} value={p}>{p}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrEditTaskModal;
 
