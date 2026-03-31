# 🔥 Sovit Premium QR Generator API

Advanced QR Code Generator with Premium Customization Features

## ✨ Features

### Core QR Types
- ✅ Plain Text
- ✅ URL/Links
- ✅ UPI Payments (with receiver name, amount, note)
- ✅ vCard/Contact
- ✅ WiFi Credentials
- ✅ Email
- ✅ Phone
- ✅ SMS

### 🎨 Advanced Customization
- **Colors**: Solid colors or gradients (2-color, multiple directions)
- **Background**: Transparent or custom color
- **Frame**: Optional frame with custom CTA text
- **Sizes**: 300px to 1000px (HD quality)
- **Export Formats**: PNG, JPEG, SVG

### 🚀 Premium Features (Coming Soon)
- Logo embedding (center branding)
- Custom dot shapes (square, rounded, circular)
- PDF export with multiple QR codes
- QR code analytics & tracking

---

## 📡 API Endpoint

**Base URL**: `https://your-project.vercel.app/api/qr`

---

## 🔧 API Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `type` | string | QR code type | `text`, `url`, `upi`, `vcard`, `wifi` |
| `data` | string | Primary data for QR | `Hello World` |

### Optional Parameters - Customization

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | number | 400 | QR code size in pixels (300-1000) |
| `format` | string | png | Export format: `png`, `jpeg`, `svg` |
| `fgColor` | string | #000000 | Foreground/QR color (hex) |
| `bgColor` | string | #ffffff | Background color (hex) |
| `transparent` | boolean | false | Transparent background |

### Gradient Options

| Parameter | Type | Description |
|-----------|------|-------------|
| `gradient` | boolean | Enable gradient colors |
| `gradientColor1` | string | First gradient color (hex) |
| `gradientColor2` | string | Second gradient color (hex) |
| `gradientDirection` | string | `diagonal`, `horizontal`, `vertical` |

### Frame Options

| Parameter | Type | Description |
|-----------|------|-------------|
| `frame` | boolean | Add frame around QR |
| `frameColor` | string | Frame border color (hex) |
| `frameText` | string | CTA text (e.g., "Scan Me") |
| `frameTextColor` | string | Frame text color (hex) |

### UPI Payment Specific

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `receiverName` | string | ✅ | Receiver's name |
| `upi` | string | ✅ | UPI ID (e.g., user@upi) |
| `amount` | number | ❌ | Payment amount |
| `note` | string | ❌ | Payment note/description |

---

## 📚 API Examples

### 1. Simple Text QR

```
GET /api/qr?type=text&data=Hello%20World
```

**Response**: PNG image

---

### 2. URL with Gradient

```
GET /api/qr?type=url&data=https://example.com&gradient=true&gradientColor1=%2300ff88&gradientColor2=%2300d4ff&gradientDirection=diagonal
```

---

### 3. UPI Payment QR

```
GET /api/qr?type=upi&receiverName=Sovit&upi=sovit@upi&amount=100&note=Payment%20for%20service
```

---

### 4. QR with Frame and CTA

```
GET /api/qr?type=url&data=https://mysite.com&frame=true&frameText=Scan%20Me&frameColor=%23000000&frameTextColor=%23ffffff
```

---

### 5. High-Res Transparent PNG

```
GET /api/qr?type=text&data=Premium&size=1000&transparent=true&fgColor=%23ff0080
```

---

### 6. WiFi QR

```
GET /api/qr?type=wifi&wifiName=MyNetwork&wifiPass=password123
```

---

### 7. vCard/Contact QR

```
GET /api/qr?type=vcard&vcardName=John%20Doe&vcardPhone=9876543210
```

---

## 🚀 Deployment to Vercel

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd qr-service
vercel --prod
```

### Step 4: Update Frontend

Edit `public/index.html` and change:

```javascript
const API_BASE = "https://your-project.vercel.app/api/qr";
```

Replace with your actual Vercel URL.

---

## 📦 Installation (Local Development)

```bash
# Clone/download the project
cd qr-service

# Install dependencies
npm install

# Run locally
vercel dev

# Visit http://localhost:3000
```

---

## 🎯 Response Format

### Success Response

**Content-Type**: `image/png` | `image/jpeg` | `image/svg+xml`

Returns the QR code image as binary data.

### Error Response

**Content-Type**: `application/json`

```json
{
  "success": false,
  "error": "Invalid or missing data"
}
```

---

## 🔥 Advanced Use Cases

### E-Commerce

Generate payment QRs with customer names and order details:

```
/api/qr?type=upi&receiverName=Store%20Name&upi=store@upi&amount=1299&note=Order%23123&frame=true&frameText=Pay%20Now
```

### Marketing

Create branded QRs with gradients:

```
/api/qr?type=url&data=https://campaign.com&gradient=true&gradientColor1=%23ff0080&gradientColor2=%23ff4444&frame=true&frameText=Visit%20Now
```

### Events

WiFi QRs for conferences:

```
/api/qr?type=wifi&wifiName=Event2024&wifiPass=secure123&size=800&frame=true&frameText=Conference%20WiFi
```

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Vercel Serverless Functions
- **QR Generation**: qrcode + canvas
- **Image Processing**: node-canvas

---

## 📄 License

Created by **SovitX** (@SovitX_developer)

For commercial use, please contact: [Your Contact]

---

## 🆘 Support

- Telegram: @SovitX_developer
- GitHub Issues: [Your Repo]

---

## 🎉 Coming Soon

- 🎨 Logo embedding in QR center
- 📊 QR analytics dashboard
- 🔗 Short URL generation
- 📱 Batch QR generation
- 💾 QR code templates library

---

Made with ⚡ by SovitX
