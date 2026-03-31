const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// Helper: Generate QR data based on type
function generateQRData(params) {
    const { type, data, upi, amount, note, receiverName, email, phone, wifiName, wifiPass, vcardName, vcardPhone } = params;
    
    switch(type) {
        case "text":
            return data || "";
            
        case "url":
            return data || "";
            
        case "upi":
            if (!upi) throw new Error("UPI ID required");
            let upiString = `upi://pay?pa=${upi}`;
            if (receiverName) upiString += `&pn=${encodeURIComponent(receiverName)}`;
            if (amount) upiString += `&am=${amount}`;
            if (note) upiString += `&tn=${encodeURIComponent(note)}`;
            upiString += `&cu=INR`;
            return upiString;
            
        case "email":
            return `mailto:${data || email}`;
            
        case "phone":
            return `tel:${data || phone}`;
            
        case "sms":
            return `smsto:${data || phone}:${note || ""}`;
            
        case "wifi":
            const ssid = data || wifiName;
            const password = note || wifiPass;
            return `WIFI:T:WPA;S:${ssid};P:${password};;`;
            
        case "vcard":
            const name = data || vcardName;
            const vphone = note || vcardPhone;
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${vphone}\nEND:VCARD`;
            
        default:
            return data || "";
    }
}

// Helper: Apply gradient to canvas
function applyGradient(ctx, width, height, color1, color2, direction = "diagonal") {
    let gradient;
    
    switch(direction) {
        case "horizontal":
            gradient = ctx.createLinearGradient(0, 0, width, 0);
            break;
        case "vertical":
            gradient = ctx.createLinearGradient(0, 0, 0, height);
            break;
        case "diagonal":
        default:
            gradient = ctx.createLinearGradient(0, 0, width, height);
            break;
    }
    
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Helper: Draw rounded rectangle
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Main handler
module.exports = async (req, res) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return res.status(200).json({ success: true });
    }
    
    try {
        const params = req.method === "GET" ? req.query : req.body;
        
        const {
            type = "text",
            data,
            size = 400,
            errorCorrection = "H",
            // Color options
            fgColor = "#000000",
            bgColor = "#ffffff",
            gradient = false,
            gradientColor1,
            gradientColor2,
            gradientDirection = "diagonal",
            // Shape options
            dotStyle = "square", // square, rounded, dots
            // Frame options
            frame = false,
            frameColor = "#000000",
            frameText = "",
            frameTextColor = "#ffffff",
            // Logo options
            logo = false,
            logoUrl,
            logoSize = 0.2, // 20% of QR size
            // Background options
            transparent = false,
            // Export format
            format = "png", // png, svg, jpeg
        } = params;
        
        // Generate QR data
        const qrData = generateQRData(params);
        
        if (!qrData) {
            return res.status(400).json({
                success: false,
                error: "Invalid or missing data"
            });
        }
        
        const qrSize = parseInt(size);
        const margin = frame ? 60 : 20;
        const canvasSize = qrSize + (margin * 2);
        
        // Create canvas
        const canvas = createCanvas(canvasSize, canvasSize);
        const ctx = canvas.getContext("2d");
        
        // Set background
        if (!transparent) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvasSize, canvasSize);
        }
        
        // Generate base QR code
        const qrOptions = {
            errorCorrectionLevel: errorCorrection,
            margin: 0,
            width: qrSize,
            color: {
                dark: fgColor,
                light: transparent ? "#00000000" : bgColor
            }
        };
        
        // Generate QR to temporary canvas
        const tempCanvas = createCanvas(qrSize, qrSize);
        await QRCode.toCanvas(tempCanvas, qrData, qrOptions);
        
        // Apply custom styling if needed
        if (gradient && gradientColor1 && gradientColor2) {
            const tempCtx = tempCanvas.getContext("2d");
            const imageData = tempCtx.getImageData(0, 0, qrSize, qrSize);
            const grad = applyGradient(tempCtx, qrSize, qrSize, gradientColor1, gradientColor2, gradientDirection);
            
            // Apply gradient to dark pixels
            tempCtx.globalCompositeOperation = "source-in";
            tempCtx.fillStyle = grad;
            tempCtx.fillRect(0, 0, qrSize, qrSize);
            tempCtx.globalCompositeOperation = "destination-over";
            tempCtx.fillStyle = transparent ? "transparent" : bgColor;
            tempCtx.fillRect(0, 0, qrSize, qrSize);
        }
        
        // Draw QR on main canvas
        ctx.drawImage(tempCanvas, margin, margin);
        
        // Add logo if specified
        if (logo && logoUrl) {
            try {
                const logoImage = await loadImage(logoUrl);
                const logoSizePixels = qrSize * parseFloat(logoSize);
                const logoX = margin + (qrSize - logoSizePixels) / 2;
                const logoY = margin + (qrSize - logoSizePixels) / 2;
                
                // White background for logo
                ctx.fillStyle = "white";
                ctx.fillRect(logoX - 5, logoY - 5, logoSizePixels + 10, logoSizePixels + 10);
                
                // Draw logo
                ctx.drawImage(logoImage, logoX, logoY, logoSizePixels, logoSizePixels);
            } catch (err) {
                console.error("Logo load error:", err.message);
            }
        }
        
        // Add frame if specified
        if (frame) {
            // Draw frame border
            ctx.strokeStyle = frameColor;
            ctx.lineWidth = 3;
            roundRect(ctx, 10, 10, canvasSize - 20, canvasSize - 20, 15);
            ctx.stroke();
            
            // Add frame text
            if (frameText) {
                ctx.fillStyle = frameColor;
                ctx.fillRect(15, canvasSize - 45, canvasSize - 30, 30);
                
                ctx.fillStyle = frameTextColor;
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(frameText.toUpperCase(), canvasSize / 2, canvasSize - 30);
            }
        }
        
        // Export based on format
        let buffer;
        let contentType;
        
        switch(format.toLowerCase()) {
            case "jpeg":
            case "jpg":
                buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
                contentType = "image/jpeg";
                break;
            case "svg":
                // SVG generation - simplified
                const svgQR = await QRCode.toString(qrData, { 
                    type: 'svg',
                    errorCorrectionLevel: errorCorrection,
                    color: {
                        dark: fgColor,
                        light: bgColor
                    }
                });
                buffer = Buffer.from(svgQR);
                contentType = "image/svg+xml";
                break;
            case "png":
            default:
                buffer = canvas.toBuffer("image/png");
                contentType = "image/png";
                break;
        }
        
        // Set response headers
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Length", buffer.length);
        Object.entries(corsHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        
        return res.status(200).send(buffer);
        
    } catch (error) {
        console.error("QR Generation Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "QR generation failed"
        });
    }
};
