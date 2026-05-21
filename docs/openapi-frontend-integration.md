# Puppy Health Manager OpenAPI 对接文档（面向前端联调）

> 版本：v1（基于当前后端实现）  
> OpenAPI 原始文件：`docs/openapi.json`  
> Base URL（本地）：`http://localhost:8000`

## 0. 通用约定

### 0.1 鉴权
除 `/health`、`/auth/register`、`/auth/login` 外，其他接口均需 Header：

```http
Authorization: Bearer <token>
```

### 0.2 通用错误码
- `401 Unauthorized`：未登录、token 无效或缺失
- `403 Forbidden`：角色无权限（owner/vet/admin 越权）
- `404 Not Found`：资源不存在（宠物、问诊队列、CMS 稿件）
- `422 Unprocessable Entity`：请求参数校验失败

### 0.3 角色说明
- `owner`：宠物主
- `vet`：兽医
- `admin`：运营/CMS 管理员
- `creator`：已保留注册角色，当前无独立接口

---

## 1. 登录页 `/login`

前端页面：`src/pages/LoginPage.tsx`

### 1.1 用户注册（调试/初始化账号）
`POST /auth/register`

请求示例：
```json
{
  "username": "owner_demo",
  "password": "pw123456",
  "role": "owner"
}
```

响应示例（201）：
```json
{
  "message": "registered"
}
```

冲突示例（409）：
```json
{
  "detail": "Username already exists"
}
```

### 1.2 用户登录
`POST /auth/login`

请求示例：
```json
{
  "username": "owner_demo",
  "password": "pw123456"
}
```

响应示例（200）：
```json
{
  "token": "<TOKEN>",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "owner_demo",
    "role": "owner"
  }
}
```

失败示例（401）：
```json
{
  "detail": "Invalid credentials"
}
```

### 1.3 前端落地建议
- 页面文案“手机号/邮箱”当前需映射到后端 `username` 字段。
- 登录后按 `user.role` 跳转：
  - `owner -> /user`
  - `vet -> /vet`
  - `admin -> /dashboard`（或 `/cms`）

---

## 2. 运营总览页 `/dashboard`

前端页面：`src/pages/DashboardPage.tsx`

### 2.1 获取运营指标（admin）
`GET /dashboard/metrics`

请求头：
```http
Authorization: Bearer <admin_token>
```

响应示例（200）：
```json
{
  "daily_active_users": 12480,
  "consult_conversion_rate": 17.3,
  "profile_creation_rate": 31.6,
  "pet_profile_count": 5,
  "open_consult_count": 3
}
```

越权示例（403，owner/vet 调用）：
```json
{
  "detail": "Forbidden"
}
```

---

## 3. 用户端页面 `/user`

前端页面：`src/pages/UserPortalPage.tsx`

### 3.1 新建宠物档案
`POST /pets`

请求示例：
```json
{
  "name": "Milo",
  "species": "dog",
  "breed": "Corgi",
  "age_months": 10,
  "weight_kg": 6.4,
  "allergy_notes": "鸡肉过敏"
}
```

响应示例（201）：
```json
{
  "id": 1
}
```

### 3.2 宠物列表
`GET /pets`

响应示例（200）：
```json
[
  {
    "id": 1,
    "name": "Milo",
    "species": "dog",
    "breed": "Corgi",
    "age_months": 10,
    "weight_kg": 6.4,
    "allergy_notes": "鸡肉过敏",
    "created_at": "2026-05-18T03:00:00Z"
  }
]
```

### 3.3 新增体重记录
`POST /pets/{pet_id}/weight-records`

请求示例：
```json
{
  "weight_kg": 6.7,
  "recorded_at": "2026-05-18T10:00:00Z"
}
```

响应示例（201）：
```json
{
  "id": 1
}
```

异常示例（404）：
```json
{
  "detail": "Pet not found"
}
```

### 3.4 体重记录列表
`GET /pets/{pet_id}/weight-records`

响应示例（200）：
```json
[
  {
    "id": 1,
    "weight_kg": 6.7,
    "recorded_at": "2026-05-18T10:00:00Z",
    "created_at": "2026-05-18T10:00:05Z"
  }
]
```

### 3.5 提醒中心（owner）
`GET /user/reminders`

响应示例（200）：
```json
[
  {
    "id": 1,
    "pet_name": "Milo",
    "species": "dog",
    "type": "vaccine",
    "due_date": "2026-06-20",
    "status": "upcoming"
  }
]
```

---

## 4. 兽医端页面 `/vet`

前端页面：`src/pages/VetPortalPage.tsx`

### 4.1 问诊队列（vet）
`GET /vet/queue`

响应示例（200）：
```json
[
  {
    "id": 1,
    "owner": "王女士",
    "symptom": "连续呕吐",
    "level": "high",
    "status": "pending",
    "created_at": "2026-05-18T03:00:00Z",
    "updated_at": "2026-05-18T03:00:00Z"
  }
]
```

### 4.2 开始接诊（vet）
`POST /vet/queue/{queue_id}/start`

响应示例（200）：
```json
{
  "id": 1,
  "status": "in_progress",
  "updated_at": "2026-05-18T03:10:00Z"
}
```

异常示例（404）：
```json
{
  "detail": "Queue item not found"
}
```

---

## 5. CMS 页面 `/cms`

前端页面：`src/pages/CmsPage.tsx`

### 5.1 稿件列表（admin）
`GET /cms/submissions`

响应示例（200）：
```json
[
  {
    "id": 1,
    "title": "犬猫过敏季护理指南",
    "author": "内容团队A",
    "status": "pending",
    "created_at": "2026-05-18T03:00:00Z",
    "updated_at": "2026-05-18T03:00:00Z"
  }
]
```

### 5.2 更新稿件状态（admin）
`PATCH /cms/submissions/{submission_id}`

请求示例：
```json
{
  "status": "approved"
}
```

`status` 可选值：`pending | in_review | approved | rejected`

响应示例（200）：
```json
{
  "id": 1,
  "title": "犬猫过敏季护理指南",
  "author": "内容团队A",
  "status": "approved",
  "updated_at": "2026-05-18T03:20:00Z"
}
```

---

## 6. 联调最小流程（建议）

1. 用 `/auth/register` 创建 `owner/vet/admin` 三类账号。
2. 分别登录拿 token（`/auth/login`）。
3. owner：创建宠物 -> 写体重记录 -> 拉提醒。
4. vet：拉问诊队列 -> 开始接诊。
5. admin：拉 dashboard 指标 -> 拉 CMS 稿件 -> PATCH 更新状态。
6. 覆盖异常流：401（缺 token）、403（角色越权）、404（不存在资源）、422（参数错误）。

---

## 7. cURL 快速示例

### 7.1 登录
```bash
curl -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"owner_demo","password":"pw123456"}'
```

### 7.2 获取 owner 提醒
```bash
curl http://localhost:8000/user/reminders \
  -H 'Authorization: Bearer <OWNER_TOKEN>'
```

### 7.3 获取 vet 队列
```bash
curl http://localhost:8000/vet/queue \
  -H 'Authorization: Bearer <VET_TOKEN>'
```

### 7.4 更新 CMS 状态
```bash
curl -X PATCH http://localhost:8000/cms/submissions/1 \
  -H 'Authorization: Bearer <ADMIN_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"status":"approved"}'
```
