const { viewDepthKey } = require('vue-router');
const TravelNote = require('../models/TravelNote');
const User = require('../models/User');
const { Op } = require('sequelize');

async function searchTravelNotes(keyword, page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  
  try {
    const { count, rows } = await TravelNote.findAndCountAll({
      include: [{
        model: User,
        attributes: ['username'], // 只返回username字段
        required: true // 确保游记有关联的用户
      }],
      where: {
        [Op.or]: [ // 使用 Op.or 表示"或"条件
          { title: { [Op.like]: `%${keyword}%` } }, // 标题匹配
          { '$User.username$': { [Op.like]: `%${keyword}%` } } // 用户名匹配
        ],
        status: 'approved'
      },
      order: [['published_at', 'DESC']],
      limit: pageSize,
      offset: offset,
      raw: true // 获取纯JSON数据，便于处理
    });

    return {
      data: rows.map(row => ({
        note_id: row.note_id,
        title: row.title,
        username: row['User.username'],
        cover_image: row.cover_image,
        view_count: row.view_count,
      })),
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

module.exports = {
  searchTravelNotes
};