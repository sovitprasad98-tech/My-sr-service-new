const QRCode = require("qrcode");

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

// Main handler
module.exports = async (req, res) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        Object.entries(corsHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
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
            // Export format
            format = "png", // png, svg
            // Margin
            margin = 1,
        } = params;
        
        // Generate QR data
        const qrData = generateQRData(params);
        
        if (!qrData) {
            Object.entries(corsHeaders).forEach(([key, value]) => {
                res.setHeader(key, value);
            });
            return res.status(400).json({
                success: false,
                error: "Invalid or missing data"
            });
        }
        
        const qrSize = parseInt(size);
        
        // QR code options
        const qrOptions = {
            errorCorrectionLevel: errorCorrection,
            margin: parseInt(margin),
            width: qrSize,
            color: {
                dark: fgColor,
                light: bgColor
            }
        };
        
        // Generate based on format
        let buffer;
        let contentType;
        
        if (format === "svg") {
            // Generate SVG
            const svgString = await QRCode.toString(qrData, {
                ...qrOptions,
                type: 'svg'
            });
            buffer = Buffer.from(svgString);
            contentType = "image/svg+xml";
        } else {
            // Generate PNG (default)
            buffer = await QRCode.toBuffer(qrData, {
                ...qrOptions,
                type: 'png'
            });
            contentType = "image/png";
        }
        
        // Set response headers
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Length", buffer.length);
        res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
        Object.entries(corsHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        
        return res.status(200).send(buffer);
        
    } catch (error) {
        console.error("QR Generation Error:", error);
        Object.entries(corsHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        return res.status(500).json({
            success: false,
            error: error.message || "QR generation failed"
        });
    }
};
