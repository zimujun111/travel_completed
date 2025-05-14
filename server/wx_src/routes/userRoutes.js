const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const UserToken = require('../models/User_token');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    // 确保上传目录存在
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
      }
      console.log('上传目录路径:', uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      console.error('创建上传目录失败:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    // 生成唯一的文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  },
  fileFilter: function (req, file, cb) {
    // 只允许上传图片
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('只允许上传图片文件！'), false);
    }
    cb(null, true);
  }
}).single('avatar');

// 上传头像
router.post('/upload/avatar', async (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer错误:', err);
      return res.status(400).json({
        success: false,
        message: '文件上传错误：' + err.message
      });
    } else if (err) {
      console.error('上传错误:', err);
      return res.status(500).json({
        success: false,
        message: '上传失败：' + err.message
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '没有上传文件'
        });
      }

      console.log('上传的文件信息:', req.file);

      const token = req.body.token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: '未提供认证令牌'
        });
      }

      // 验证token并获取用户信息
      const userToken = await UserToken.findOne({
        where: {
          token: token,
          expires_at: {
            [Op.gt]: new Date()
          }
        }
      });

      if (!userToken) {
        return res.status(401).json({
          success: false,
          message: '无效的认证令牌'
        });
      }

      // 更新用户头像
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      await User.update(
        { avatar_url: avatarUrl },
        { where: { user_id: userToken.user_id } }
      );

      res.json({
        success: true,
        message: '头像上传成功',
        url: avatarUrl
      });
    } catch (error) {
      console.error('处理上传文件错误:', error);
      res.status(500).json({
        success: false,
        message: '上传失败，请稍后重试'
      });
    }
  });
});

//登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '密码错误'
      });
    }
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await UserToken.create({
      user_id: user.user_id,
      token: token,
      expires_at: expiresAt
    });
    await user.update({
      last_login_at: new Date()
    });
    res.status(200).json({
      success: true,
      message: '登录成功',
      user: {
        user_id: user.user_id,
        username: user.username,
        avatar_url: user.avatar_url,   
        token: token
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
});
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      });
    }

   
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

 
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: '邮箱已被注册'
      });
    }

 
    const user = await User.create({
      username,
      password_hash: password, 
      email,
      status: 1,
      created_at: new Date(),
      updated_at: new Date()
    });


    res.status(201).json({
      success: true,
      message: '注册成功',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        status: user.status,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    });
  }
});

module.exports = router; 