# Hướng dẫn Deploy lên Render

## Bước 1: Chuẩn bị

### Kiểm tra yêu cầu:
- Có tài khoản GitHub và đã push code lên (cần public hoặc private repo)
- Có tài khoản Render (render.com)
- Có MongoDB Atlas account (mongodb.com) hoặc sử dụng Render PostgreSQL

### Tạo MongoDB Atlas Database:
1. Đăng nhập vào [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo project mới
3. Tạo cluster (chọn tier free)
4. Tạo database user với password
5. Copy connection string:
   - Dạng: `mongodb+srv://username:password@cluster.mongodb.net/weather-forecasting?retryWrites=true&w=majority`

## Bước 2: Deploy trên Render

### Cách 1: Dùng render.yaml (Recommended)

1. **Push repository lên GitHub:**
   ```bash
   git add .
   git commit -m "Add Render configuration"
   git push origin main
   ```

2. **Trên Render Dashboard:**
   - Đăng nhập vào [dashboard.render.com](https://dashboard.render.com)
   - Nếu chưa kết nối GitHub: 
     - Chọn "New +" → "Blueprint"
     - Kết nối GitHub account
   
   - Chọn "New +" → "Blueprint"
   - Chọn repository `weather-forecasting`
   - Chọn branch `main` 
   - Nhập tên service (ví dụ: weather-app)
   - Review cấu hình render.yaml
   - Nhập các Environment Variables:
     - `MONGODB_URI`: Lấy từ MongoDB Atlas
     - `JWT_SECRET`: Tạo secret dài (tối thiểu 32 ký tự), ví dụ: `openssl rand -base64 32`
     - `OPENWEATHER_API_KEY`: Từ [openweathermap.org](https://openweathermap.org)
   - Deploy!

### Cách 2: Deploy thủ công (Manual)

**Deploy API:**
1. Chọn "New +" → "Web Service"
2. Kết nối GitHub repository
3. Cấu hình:
   - **Name**: weather-api
   - **Branch**: main
   - **Build Command**: `cd api && npm install && npm run build`
   - **Start Command**: `cd api && npm run start:prod`
   - **Publish directory**: (để trống)
   - **Environment**:
     - `NODE_ENV`: production
     - `PORT`: 3001
     - `MONGODB_URI`: [MongoDB connection string]
     - `JWT_SECRET`: [Your JWT secret]
     - `OPENWEATHER_API_KEY`: [Your API key]
4. Deploy

**Deploy Web:**
1. Chọn "New +" → "Web Service"
2. Kết nối GitHub repository
3. Cấu hình:
   - **Name**: weather-web
   - **Branch**: main
   - **Build Command**: `cd web && npm install && npm run build`
   - **Start Command**: `cd web && npm run start`
   - **Publish directory**: (để trống)
   - **Environment**:
     - `NODE_ENV`: production
     - `NEXT_PUBLIC_API_URL`: `https://weather-api.onrender.com` (URL của API service bạn vừa deploy)
4. Deploy

## Bước 3: Kiểm tra

1. Chờ cả hai services build và deploy thành công
2. Mở URL của web service trong trình duyệt
3. Kiểm tra các tính năng:
   - Đăng ký/Đăng nhập
   - Tìm kiếm thời tiết
   - Xem lịch sử tìm kiếm

## Troubleshooting

### API không kết nối được MongoDB:
- Kiểm tra MongoDB connection string
- Nếu dùng MongoDB Atlas, thêm IP của Render vào whitelist:
  - Vào MongoDB Atlas → Network Access
  - Thêm IP: `0.0.0.0/0` (cho phép tất cả - chỉ dùng cho dev)

### Web không kết nối được API:
- Kiểm tra `NEXT_PUBLIC_API_URL` trỏ đúng tới API URL
- Kiểm tra CORS settings trên API (nếu cần)

### Build bị lỗi:
- Kiểm tra logs trong Render dashboard
- Đảm bảo Node version >= 20.9.0
- Kiểm tra `package.json` scripts

## URLs sau khi Deploy

- **API**: `https://weather-api.onrender.com`
- **Web**: `https://weather-web.onrender.com`

## Lưu ý quan trọng

- **Free tier Render**: Services sẽ spin down sau 15 phút không hoạt động
- **MongoDB Atlas free tier**: Giới hạn 512MB storage
- Để production-ready, nâng cấp lên paid plan
- Luôn bảo mật JWT_SECRET, không commit lên git

## Cập nhật sau khi Deploy

Mỗi khi push code mới lên GitHub, Render sẽ tự động:
1. Trigger rebuild
2. Build ứng dụng
3. Deploy phiên bản mới

Không cần làm gì thêm!
