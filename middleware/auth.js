const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const base64url = require('base64url');
require('dotenv').config();

// Hàm tạo Code Verifier và Code Challenge cho PKCE
function generateCodeVerifierAndChallenge() {
    const codeVerifier = base64url(crypto.randomBytes(32));
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = base64url(hash);
    return { codeVerifier, codeChallenge };
}

// Xác thực token JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        req.user = decoded;
        next();
    });
};

// Kiểm tra vai trò người dùng
const checkRole = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = { authenticateToken, checkRole, generateCodeVerifierAndChallenge };
