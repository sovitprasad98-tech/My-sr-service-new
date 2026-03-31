# 🚀 Vercel Par Deploy Kaise Karein (Complete Guide)

## Step 1: Vercel Account Setup

1. **Vercel.com** par jao
2. **Sign Up** karo (GitHub se login best hai)
3. Free plan select karo

---

## Step 2: Project Upload

### Option A: GitHub Se Deploy (Recommended ⭐)

1. **GitHub** par naya repository banao
2. Is `qr-service` folder ko upload karo:
   ```bash
   cd qr-service
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/qr-api.git
   git push -u origin main
   ```

3. **Vercel Dashboard** me jao
4. **"New Project"** click karo
5. **GitHub repository** select karo
6. **Deploy** button click karo

### Option B: Vercel CLI Se Deploy

1. **Vercel CLI install** karo:
   ```bash
   npm install -g vercel
   ```

2. **Login** karo:
   ```bash
   vercel login
   ```

3. **Deploy** karo:
   ```bash
   cd qr-service
   vercel --prod
   ```

---

## Step 3: Deployment Settings

Vercel dashboard me deployment ke time yeh settings check karo:

**Framework Preset**: Other  
**Root Directory**: ./  
**Build Command**: (leave empty)  
**Output Directory**: (leave empty)  
**Install Command**: npm install

---

## Step 4: API URL Copy Karo

Deploy hone ke baad aapko URL milega:
```
https://your-project-name.vercel.app
```

**API Endpoint**:
```
https://your-project-name.vercel.app/api/qr
```

---

## Step 5: Frontend Update Karo

`public/index.html` file kholo aur line 358 par API URL change karo:

**Change this:**
```javascript
const API_BASE = "https://your-project.vercel.app/api/qr";
```

**To your actual URL:**
```javascript
const API_BASE = "https://sovit-qr-pro.vercel.app/api/qr";
```

---

## Step 6: Test Karo

Browser me jao:
```
https://your-project-name.vercel.app
```

Frontend khulega with QR generator!

**API Test karo:**
```
https://your-project-name.vercel.app/api/qr?type=text&data=Hello
```

QR code image dikhna chahiye!

---

## ⚡ Quick Commands

```bash
# Local test (development)
npm install
vercel dev

# Production deploy
vercel --prod

# Logs dekhna
vercel logs

# Domain settings
vercel domains
```

---

## 🔧 Troubleshooting

### Error: "Module not found"
**Solution**: 
```bash
rm -rf node_modules
npm install
vercel --prod
```

### Error: "Canvas not working"
Vercel automatically canvas library install kar deta hai. Agar error aaye to:

`vercel.json` me check karo ki yeh hai:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ]
}
```

### Frontend API se connect nahi ho raha
`index.html` me API_BASE URL check karo. Trailing slash nahi hona chahiye:
```javascript
// ✅ Correct
const API_BASE = "https://your-app.vercel.app/api/qr";

// ❌ Wrong
const API_BASE = "https://your-app.vercel.app/api/qr/";
```

---

## 🎯 Custom Domain Add Karna

1. Vercel Dashboard → Your Project → Settings
2. **Domains** tab me jao
3. **Add Domain** click karo
4. Apna domain enter karo (e.g., `qr.sovitx.com`)
5. DNS settings update karo (Vercel guide dega)

---

## 💡 Pro Tips

1. **Environment Variables**: Agar koi secret keys chahiye (future me), to Vercel Dashboard → Settings → Environment Variables me add karo

2. **Auto Deploy**: GitHub se connect karne se har push par auto deploy hoga

3. **Serverless Limits**: 
   - Function timeout: 10 seconds (free plan)
   - Max file size: 50 MB
   - Yeh QR API ke liye bahut hai!

4. **Analytics**: Vercel Analytics enable kar sakte ho (free hai)

---

## 📊 Monitoring

Vercel Dashboard me:
- **Deployments**: All deployments list
- **Analytics**: Traffic stats
- **Logs**: Real-time logs
- **Performance**: Speed metrics

---

## 🔄 Update Kaise Karein

### GitHub Se:
```bash
git add .
git commit -m "Updated features"
git push
```
Auto deploy ho jayega!

### Vercel CLI Se:
```bash
vercel --prod
```

---

## 🎉 Done!

Ab aapka QR API live hai aur permanent hosted!

**Your URLs:**
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/qr`

Share karo aur use karo! 🚀

---

## 📞 Help Chahiye?

Telegram: @SovitX_developer

Happy Coding! ⚡
