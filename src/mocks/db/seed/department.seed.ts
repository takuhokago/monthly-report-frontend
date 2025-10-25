import type { DepartmentDto } from '../../../app/features/departments/models/department.dto';

export function seedDepartments(): DepartmentDto[] {
  // 初期データ（IDは固定。増減させたい場合は store 側の nextId 設定で調整）
  return [
    { id: 1, name: '総務部' },
    { id: 2, name: '開発部' },
    { id: 3, name: '営業部' },
    { id: 4, name: '人事部' },
  ];
}
