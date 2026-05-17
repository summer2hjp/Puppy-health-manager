# 🐾 Puppy Health Manager - 数据库设计 (ER 图草稿)

以下是 Puppy Health Manager 项目的初步数据库设计，主要概念包括宠物档案、用户管理、问诊记录等。后续迭代中，我们可以根据项目需求进一步细化。

---

## 📋 1. 实体和关系

### 1.1 **用户 (User)**
字段：
- `id` (PK): 用户唯一标识
- `username`: 用户名
- `email`: 邮箱 (唯一索引)
- `password`: 哈希密码
- `role`: 用户角色（宠物主、兽医、创作者）
- `created_at`: 注册时间
- `updated_at`: 最后更新时间

### 1.2 **宠物档案 (Pet_Record)**
字段：
- `id` (PK): 档案唯一标识
- `user_id` (FK): 属主用户 ID (关联 User 表)
- `name`: 宠物昵称
- `species`: 宠物类别（狗、猫等）
- `breed`: 品种
- `gender`: 性别
- `birth_date`: 出生日期
- `chip_id`: 芯片号
- `vaccination_status`: 疫苗状态
- `created_at`: 创建时间
- `updated_at`: 最后更新时间

关系：
- 一对多：一个用户可以管理多只宠物。

### 1.3 **问诊记录 (Consult_Record)**
字段：
- `id` (PK): 问诊唯一标识
- `pet_id` (FK): 关联宠物档案 (Pet_Record)
- `vet_id` (FK): 接诊兽医 ID (关联 User 表)
- `symptoms`: 症状描述
- `diagnosis`: 诊断
- `recommendation`: 医嘱建议
- `created_at`: 创建时间

### 1.4 **科普内容 (Knowledge)**
字段：
- `id` (PK): 科普内容唯一标识
- `creator_id` (FK): 作者用户 ID (关联 User 表，内容创作者)
- `title`: 标题
- `content`: 文章内容
- `tags`: 标签数组
- `created_at`: 发布时间
- `updated_at`: 最后修改时间

### 1.5 **服务预约 (Appointment)**
字段：
- `id` (PK): 预约记录唯一标识
- `pet_id` (FK): 关联宠物档案 (Pet_Record)
- `clinic_id`: 诊所/医院 ID (可对接 LBS 模块)
- `appointment_date`: 预约日期和时间
- `status`: 预约状态（待确认、已预约、已完成）
- `created_at`: 创建时间

---

## 📦 2. 数据库设计图 (ER 图概述)

```plaintext
User
| id (PK)
| username
| email
| password
| role
| created_at
| updated_at
      | 1
      |
      | N
      ↓
Pet_Record
| id (PK)
| user_id (FK)
| name
| species
| breed
| gender
| birth_date
| chip_id
| vaccination_status
| created_at
| updated_at
      | 1
      |
      | N
      ↓
Consult_Record
| id (PK)
| pet_id (FK)
| vet_id (FK)
| symptoms
| diagnosis
| recommendation
| created_at

Appointment
| id (PK)
| pet_id (FK)
| clinic_id
| appointment_date
| status
| created_at

Knowledge
| id (PK)
| creator_id (FK)
| title
| content
| tags
| created_at
| updated_at
```

---

## 📊 3. 后续优化方向

1. **字段设计优化**：增加业务扩展字段，如问诊附属文件（病例、处方）等。
2. **索引建议**：频繁查询的字段（如 email, pet_id）建立数据库索引。
3. **删改约束**：设置合理的外键级联操作（如宠物删除需同时删除问诊记录）。
4. **日志与审计**：记录数据变更历史，以支持服务合规性。