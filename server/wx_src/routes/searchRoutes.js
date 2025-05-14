const express = require('express');
const router = express.Router();
const { searchTravelNotes } = require('../controllers/searchController');
const TravelNote = require('../models/TravelNote');
const image = require('../models/image');
const User = require('../models/User');
router.get('/', async (req, res) => {
  try {
    const { q, page = 1, pageSize = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search keyword is required' });
    }
    
    const result = await searchTravelNotes(q, parseInt(page), parseInt(pageSize));
    res.json(result);
  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/:noteId', async (req, res) => {
  try {
    
    const { noteId } = req.params;
    console.log('noteId:', noteId); // 打印noteId以确认其值是否正确
    const notes = await TravelNote.findAndCountAll({
      where: {
        note_id: noteId,
      },
      order: [['created_at', 'DESC']],
     
      include: [
        {
          model: User,
          attributes: ['username', 'avatar_url']
        },
        {
          model: image,
          attributes: ['url']
        },
        {
          model: require('../models/rejectReason'),
          as: 'reject_reason',
          attributes: ['reason'],
          required: false
        }
      ]
    });

    // 处理返回数据，添加拒绝原因
    const processedNotes = notes.rows.map(note => {
      const noteData = note.get({ plain: true });
      if (noteData.status === 'rejected' && noteData.RejectReason) {
        noteData.rejectReason = noteData.RejectReason.reason;
      }
      return noteData;
    });

    res.json({
      success: true,
      data: {
        total: notes.count,
        list: processedNotes
      }
    });
  } catch (error) {
    console.error('获取对应游记失败:', error);
    res.status(500).json({
      success: false,
      message: '获取对应游记失败'
    });
  }
});
module.exports = router;