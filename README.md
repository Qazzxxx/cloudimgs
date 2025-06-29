# CloudImgs - 简单、方便的开源图床项目，支持 NAS 部署

一个简单、方便的开源图床项目，一键 NAS 部署，支持图片上传、管理、预览和分享。

## 功能特性

### 🚀 核心功能

- **图片上传**: 支持拖拽上传，多种图片格式
- **图片管理**: 浏览、预览、下载、删除图片
- **图片分享**: 一键复制图片链接
- **统计信息**: 实时显示存储使用情况

### 📁 子目录管理 (新增)

- **智能目录选择**: 可选择现有目录或输入新目录
- **目录信息展示**: 在图片管理页面显示当前目录信息
- **目录统计**: 支持按目录统计图片数量和存储大小

## 技术栈

### 前端

- React 18
- Ant Design 5
- Axios
- Day.js

### 后端

- Node.js
- Express
- Multer
- fs-extra

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
```

### 启动服务

```bash
# 启动后端服务 (端口 3001)
node server/index.js

# 启动前端开发服务器 (端口 3000)
cd client
npm start
```

### 快速部署 - docker-componse.yml

```yaml
version: "3.8"

services:
  cloudimgs:
    # 使用 Docker Hub 上的镜像
    image: qazzxxx/cloudimgs:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - STORAGE_PATH=/app/uploads
    volumes:
      - ./uploads:/app/uploads # 上传目录配置
      - ./logs:/app/logs
    restart: unless-stopped
    container_name: cloudimgs-app
```

## 使用说明

### 图片上传

1. 点击"上传图片"菜单
2. 选择或输入子目录（可选）
   - 可以从下拉列表选择现有目录
   - 可以输入新目录路径（如：2024/06/10）
3. 拖拽或点击选择图片文件
4. 支持批量上传

### 图片管理

1. 点击"图片管理"菜单
2. 选择要浏览的目录
3. 支持搜索图片名称
4. 可以预览、下载、复制链接或删除图片
5. 当前目录信息会显示在页面顶部

### 统计信息

1. 点击"统计信息"菜单
2. 查看总体存储使用情况
3. 支持按目录查看统计信息

## 配置说明

### 环境变量

创建 `.env` 文件：

```env
PORT=3001
STORAGE_PATH=./uploads
```

### 存储路径

- 默认存储路径：`./uploads`
- 支持多层目录结构
- 自动创建不存在的目录

## 文件格式支持

- **图片格式**: JPG, PNG, GIF, WebP, BMP, SVG
- **文件大小**: 最大 10MB
- **目录结构**: 支持无限层级的子目录

## API 接口

### 📤 图片上传

```
POST /api/upload
```

**参数说明：**

- `image` (必需): 图片文件，支持 multipart/form-data
- `dir` (可选): 子目录路径，如 "2024/06/10" 或 "相册/家庭"

**支持格式：** JPG, PNG, GIF, WebP, BMP, SVG  
**文件大小限制：** 最大 10MB

**curl 示例：**

```bash
# 上传到根目录
curl -X POST http://localhost:3001/api/upload \
  -F "image=@/path/to/your/image.jpg"

# 上传到指定子目录
curl -X POST "http://localhost:3001/api/upload?dir=2024/06/10" \
  -F "image=@/path/to/your/image.jpg"

# 上传中文文件名图片
curl -X POST "http://localhost:3001/api/upload?dir=相册/家庭" \
  -F "image=@/path/to/你的图片.jpg"
```

**响应示例：**

```json
{
  "success": true,
  "message": "图片上传成功",
  "data": {
    "filename": "image.jpg",
    "originalName": "原始文件名.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg",
    "uploadTime": "2024-01-01T12:00:00.000Z",
    "url": "/api/images/image.jpg",
    "relPath": "image.jpg"
  }
}
```

### 📋 获取图片列表

```
GET /api/images
```

**参数说明：**

- `dir` (可选): 指定目录路径，如 "2024/06/10"

**curl 示例：**

```bash
# 获取根目录所有图片
curl http://localhost:3001/api/images

# 获取指定目录图片
curl "http://localhost:3001/api/images?dir=2024/06/10"
```

**响应示例：**

```json
{
  "success": true,
  "data": [
    {
      "filename": "image.jpg",
      "relPath": "image.jpg",
      "size": 1024000,
      "uploadTime": "2024-01-01T12:00:00.000Z",
      "url": "/api/images/image.jpg"
    }
  ]
}
```

### 🎲 获取随机图片

```
GET /api/random
```

**参数说明：**

- `dir` (可选): 指定目录路径

**curl 示例：**

```bash
# 获取根目录随机图片
curl http://localhost:3001/api/random

# 获取指定目录随机图片
curl "http://localhost:3001/api/random?dir=2024/06/10"
```

### 📊 获取统计信息

```
GET /api/stats
```

**参数说明：**

- `dir` (可选): 指定目录路径

**curl 示例：**

```bash
# 获取总体统计
curl http://localhost:3001/api/stats

# 获取指定目录统计
curl "http://localhost:3001/api/stats?dir=2024/06/10"
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "totalImages": 100,
    "totalSize": 104857600,
    "storagePath": "/app/uploads"
  }
}
```

### 📁 获取目录列表

```
GET /api/directories
```

**参数说明：**

- `dir` (可选): 指定父目录路径

**curl 示例：**

```bash
# 获取根目录下的子目录
curl http://localhost:3001/api/directories

# 获取指定目录下的子目录
curl "http://localhost:3001/api/directories?dir=2024"
```

**响应示例：**

```json
{
  "success": true,
  "data": [
    {
      "name": "2024",
      "path": "2024",
      "fullPath": "/app/uploads/2024"
    }
  ]
}
```

### 🗑️ 删除图片

```
DELETE /api/images/{图片路径}
```

**参数说明：**

- `图片路径` (必需): 图片的相对路径，如 "image.jpg" 或 "2024/06/10/image.jpg"

**curl 示例：**

```bash
# 删除根目录图片
curl -X DELETE "http://localhost:3001/api/images/image.jpg"

# 删除子目录图片
curl -X DELETE "http://localhost:3001/api/images/2024/06/10/image.jpg"
```

### 📖 图片访问

```
GET /api/images/{图片路径}
```

**说明：** 直接访问图片文件，支持中文文件名和目录名

**示例：**

```bash
# 访问根目录图片
curl http://localhost:3001/api/images/image.jpg

# 访问子目录图片
curl http://localhost:3001/api/images/2024/06/10/image.jpg
```

### ⚠️ 注意事项

- 所有 API 都支持中文文件名和目录名，会自动进行 URL 编码处理
- 图片访问 URL 可以直接在浏览器中打开
- 目录路径支持无限层级嵌套
- 文件名会自动处理特殊字符，但保留中文字符
- 上传时会自动检查文件类型和大小限制

## 更新日志

### v1.1.0 (最新)

- ✨ 新增子目录管理功能
- ✨ 智能目录选择器
- ✨ 目录信息展示
- ✨ 支持输入新目录
- 🎨 优化用户界面

### v1.0.0

- 🎉 初始版本发布
- 📤 图片上传功能
- 🖼️ 图片管理功能
- 📊 统计信息功能

## 许可证

MIT License
