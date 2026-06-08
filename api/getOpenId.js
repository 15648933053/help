/**
 * Vercel Serverless Function - 微信小程序 code 换 openid
 *
 * 使用方式：GET /api/getOpenId?code=xxx
 *
 * 环境变量（在 Vercel 项目设置中配置）：
 * - WX_APPID: 微信小程序 AppID
 * - WX_SECRET: 微信小程序 AppSecret
 */

module.exports = async function handler(req, res) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  const appId = process.env.WX_APPID;
  const appSecret = process.env.WX_SECRET;

  if (!appId || !appSecret) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const https = require('https');

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;

    const data = await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        let body = '';
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch (e) { reject(e); }
        });
      }).on('error', reject);
    });

    if (data.errcode) {
      console.error('WeChat API error:', data);
      return res.status(400).json({ error: data.errmsg || 'WeChat API error' });
    }

    return res.status(200).json({
      openid: data.openid,
      session_key: data.session_key,
    });
  } catch (error) {
    console.error('Get openid error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
