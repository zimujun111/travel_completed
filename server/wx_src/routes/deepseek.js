const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: '4af3f2fe-65bf-4942-943e-cb1df6b34ea3',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

router.post('/', async (req, res) => {
    try {
      const { content } = req.body;
      
      const stream = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: '你是人工智能助手' },
          { role: 'user', content: content+'请帮我整理一下，这样比较乱可以帮我安排每一天都干什么，字数限制在300字以内' },
        ],
        model: 'deepseek-v3-250324',
        stream: true,
      });
      
      for await (const part of stream) {
        const content = part.choices[0]?.delta?.content || ''
        res.write(`data: ${JSON.stringify({content})}\n\n`)
      }
      
      res.end()
    } catch (error) {
      console.error('Search route error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;