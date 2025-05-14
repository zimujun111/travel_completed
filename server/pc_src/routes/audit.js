const express = require('express');
const router = express.Router();
const TravelNote = require('../models/TravelNote');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const RejectReason = require('../models/RejectReason');
const image = require('../models/image');
const RecycleBin = require('../models/RecycleBin'); 


// 获取所有游记
router.get('/allTravelNotes', async (req, res) => {
  try {
   
    
    const notes = await TravelNote.findAndCountAll({
      
      order: [['created_at', 'DESC']],
      
      include: [{
        model: User,
        attributes: ['username', 'avatar_url']
      },
      {
        model: image,
        attributes: ['url']
      },
    ]
    });
    res.json({
      success: true,
      data: {
        total: notes.count,
        list: notes.rows,
        
      }
    });
  } catch (error) {
    console.error('获取已审核游记列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取游记列表失败'
    });
  }
});






// 更新游记状态
router.post('/updateNoteStatus/:note_id', async (req, res) => {
  try {
    const { note_id } = req.params;
    const { status } = req.body;
    const { reject_reason } = req.body;
    const updated = await TravelNote.update(
      { status },
      { where: { note_id: note_id } }
    );
    
    if (updated[0] === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到指定游记'
      });
    }
    
    if (status === 'rejected') {
      if (!reject_reason) {
        return res.status(400).json({
          success: false,
          message: '拒绝原因不能为空'
        });
      }
      await RejectReason.create({ note_id, reason:reject_reason });
    }
    
    res.json({
      success: true,
      message: '状态更新成功'
    });
  } catch (error) {
    console.error('更新游记状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新游记状态失败'
    });
  }
});

// 删除游记并移动到回收站
router.post('/deleteNote/:note_id', async (req, res) => {
  try {
    const { note_id } = req.params;
      // 查询原数据
      const note = await TravelNote.findOne({
        where: { note_id },
      });
      
      if (!note) {
        return res.status(404).json({
          success: false,
          message: '未找到指定游记'
        });
      }
      
      // 插入到回收站
      await RecycleBin.create({
        ...note.dataValues,
        deleted_at: new Date()
      });
      
      // 从原表删除
      await TravelNote.destroy({
        where: { note_id },
      });
      res.json({
        success: true,
        message: '游记已删除并移动到回收站'
      });
    
  } catch (error) {
    console.error('删除游记失败:', error);
    res.status(500).json({
      success: false,
      message: '删除游记失败'
    });
  }
});

module.exports = router;