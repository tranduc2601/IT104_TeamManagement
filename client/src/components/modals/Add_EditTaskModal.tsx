import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import "antd/dist/reset.css";

interface AddOrEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    name: string;
    assignee: string;
    status: string;
    startDate?: string;
    endDate?: string;
    priority?: string;
    progress?: string;
  }) => void;
  initialData?: {
    name: string;
    assignee: string;
    status: string;
    startDate?: string;
    endDate?: string;
    priority?: string;
    progress?: string;
  };
  existingNames?: string[]; // for duplicate name validation
}

const { Option } = Select;

const statusOptions = ["To do", "In Progress", "Pending", "Done"];
const priorityOptions = ["Thấp", "Trung Bình", "Cao"];
const progressOptions = [
  "Đúng tiến độ",
  "Có rủi ro",
  "Trễ hạn",
  "Hoàn thành",
  "Chưa cập nhật",
];

const AddOrEditTaskModal: React.FC<AddOrEditTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingNames = [],
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        assignee: initialData.assignee,
        status: initialData.status,
        priority: initialData.priority ?? undefined,
        progress: initialData.progress ?? undefined,
        startDate: initialData.startDate ?? undefined,
        endDate: initialData.endDate ?? undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form, isOpen]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const startDate = values.startDate
        ? (values.startDate as { format: (f: string) => string }).format(
            "MM/DD/YYYY"
          )
        : undefined;
      const endDate = values.endDate
        ? (values.endDate as { format: (f: string) => string }).format(
            "MM/DD/YYYY"
          )
        : undefined;
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
      title={initialData ? "Sửa nhiệm vụ" : "Thêm/sửa nhiệm vụ"}
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      okText={initialData ? "Lưu" : "Lưu"}
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
            { required: true, message: "Tên nhiệm vụ không được để trống" },
            {
              validator: (_: unknown, value: unknown) => {
                const raw =
                  typeof value === "string"
                    ? value.trim()
                    : value
                    ? String(value).trim()
                    : "";
                if (!raw) return Promise.resolve();
                const duplicate = existingNames.some(
                  (n: string) => n.toLowerCase() === raw.toLowerCase()
                );
                if (
                  duplicate &&
                  !(
                    initialData &&
                    initialData.name.toLowerCase() === raw.toLowerCase()
                  )
                ) {
                  return Promise.reject(new Error("Tên nhiệm vụ đã tồn tại"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Nhập tên nhiệm vụ" />
        </Form.Item>

        <Form.Item label="Người phụ trách" name="assignee">
          <Input placeholder="Chọn người phụ trách" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Chọn trạng thái nhiệm vụ" }]}
        >
          <Select placeholder="Chọn trạng thái nhiệm vụ">
            {statusOptions.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Ngày bắt đầu" name="startDate">
          <DatePicker style={{ width: "100%" }} format={"MM/DD/YYYY"} />
        </Form.Item>

        <Form.Item label="Hạn cuối" name="endDate">
          <DatePicker style={{ width: "100%" }} format={"MM/DD/YYYY"} />
        </Form.Item>

        <Form.Item label="Độ ưu tiên" name="priority">
          <Select placeholder="Chọn độ ưu tiên">
            {priorityOptions.map((p) => (
              <Option key={p} value={p}>
                {p}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Tiến độ" name="progress">
          <Select placeholder="Chọn tiến độ">
            {progressOptions.map((p) => (
              <Option key={p} value={p}>
                {p}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrEditTaskModal;
