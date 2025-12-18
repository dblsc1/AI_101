
export interface Module {
  id: string;
  name: string;
  description: string;
}

export interface Domain {
  id: string;
  title: string;
  modules: Module[];
}

export const CURRICULUM_DATA: Domain[] = [
  {
    id: 'ai-fundamentals',
    title: 'LLM初探',
    modules: [
      { id: 'm1', name: '强大的大语言模型', description: '为不熟悉语言模型的孩子准备的基础课，通过文章总结，快速生成复杂文本和逻辑，迅速熟悉各大最先进的大语言模型。' },
      { id: 'm2', name: '大语言模型错误百出？', description: '通过3个简单实验发现AI的能力边界，破除"AI无所不能"的迷思。' },
      { id: 'm3', name: '驯服大语言模型', description: '学会调教AI，让AI按照要求输出，在比赛中学习，为智能体打下基础' },
      { id: 'm4', name: '未来已来：智能体', description: '熟悉扣子平台的运作，创建一个简单的智能体（ppt生成智能体）' },
      // { id: 'm1-extra', name: '反向传播算法', description: '深入理解梯度下降与链式法则，揭示模型学习的核心动力。' },
      // { id: 'm1-extra2', name: '卷积神经网络', description: '研究专门用于处理网格结构数据的神经网络，如图像与视频。' }
    ]
  },
  {
    id: 'generative-ai',
    title: '图像与多模态AI',
    modules: [
      { id: 'm5', name: '图像AI agent 2025/12', description: '使用图像生成模型veo ，豆包，创作属于自己的AI艺术作品。' },
      { id: 'm6', name: '视频AI agent 2025/12', description: '使用视频生成模型sora2 豆包，创作属于自己的AI视频作品。' },
      { id: 'm8', name: '多模态交互AI 2025/12', description: '探索视觉、听觉与文本的融合处理，创作一个基于语音通话机器人' },
      // { id: 'm2-extra', name: 'LoRA 微调技术', description: '学习如何以极低的算力成本对大模型进行特定领域知识的迁移与强化。' },
    ]
  },
  {
    id: 'real-world-apps',
    title: 'AI agent实践',
    modules: [
      { id: 'm9', name: '扣子平台基本操作', description: '学习扣子平台的基本操作，提示词设置，工作流和多Agent配合。' },
      { id: 'm10', name: '你画我猜智能体', description: '结合图像识别LLM和文本生成LLM，创建一个你画我猜智能体。' },
      { id: 'm11', name: '错题批改智能体', description: '结合图像识别LLM和逻辑判断LLM，创建一个错题批改智能体。' },
      { id: 'm12', name: '敬请期待', description: '' },
      // { id: 'm3-extra', name: '金融风控建模', description: '利用AI实时监测交易风险，在毫秒级时间内识别并阻止欺诈行为。' }
    ]
  },
  // {
  //   id: 'future-tech',
     title: '前沿探索',
     modules: [
       { id: 'm13', name: '敬请期待''敬请期待''jing'qin''qi'd'敬请期待},
     ]
   }
];
