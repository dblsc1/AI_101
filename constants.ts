
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
    title: 'AI 基础理论',
    modules: [
      { id: 'm1', name: '神经网络导论', description: '探索人工神经网络的基本结构，理解神经元、层与权重如何模拟人类大脑的处理逻辑。' },
      { id: 'm2', name: '机器学习简史', description: '从统计学起源到深度学习革命，回顾改变世界的算法演进历程。' },
      { id: 'm3', name: '数据偏见分析', description: '识别训练数据中的潜在歧视，学习如何构建更公平、更客观的AI系统。' },
      { id: 'm4', name: '算法伦理', description: '探讨技术边界与社会责任，研究在自动驾驶与医疗决策中的道德考量。' },
      { id: 'm1-extra', name: '反向传播算法', description: '深入理解梯度下降与链式法则，揭示模型学习的核心动力。' },
      { id: 'm1-extra2', name: '卷积神经网络', description: '研究专门用于处理网格结构数据的神经网络，如图像与视频。' }
    ]
  },
  {
    id: 'generative-ai',
    title: '生成式人工智能',
    modules: [
      { id: 'm5', name: '大语言模型原理', description: '解析Transformer架构与注意力机制，理解文字生成背后的概率预测逻辑。' },
      { id: 'm6', name: 'Prompt 工程', description: '掌握与AI对话的艺术，通过精准的指令引导模型输出高质量、专业化内容。' },
      { id: 'm7', name: '图像生成艺术', description: '从扩散模型到创作者经济，探索文本转图像如何重新定义视觉传达。' },
      { id: 'm8', name: '多模态交互', description: '研究视觉、听觉与文本的融合处理，打造更自然的跨媒介感知体验。' },
      { id: 'm2-extra', name: 'LoRA 微调技术', description: '学习如何以极低的算力成本对大模型进行特定领域知识的迁移与强化。' },
      { id: 'm2-extra2', name: '长文本建模', description: '探讨如何处理万级乃至百万级Token的输入，实现全书级别的知识检索。' }
    ]
  },
  {
    id: 'real-world-apps',
    title: '行业应用实践',
    modules: [
      { id: 'm9', name: 'AI 辅助编程', description: '利用Copilot等工具加速代码构建，探索软件工程在新时代的效率范式。' },
      { id: 'm10', name: '智能医疗初探', description: '分析AI在影像诊断、新药研发与病历管理中的前沿应用。' },
      { id: 'm11', name: '自动化营销', description: '通过行为预测与内容生成，实现千人千面的精准品牌沟通。' },
      { id: 'm12', name: '个性化教育', description: '构建针对不同学习进度、兴趣偏好的AI导师，实现真正意义上的因材施教。' },
      { id: 'm3-extra', name: '金融风控建模', description: '利用AI实时监测交易风险，在毫秒级时间内识别并阻止欺诈行为。' }
    ]
  },
  {
    id: 'future-tech',
    title: '前沿探索',
    modules: [
      { id: 'm13', name: '具身智能', description: '赋予AI物理载体，研究机器人如何在现实世界中感知、规划并执行任务。' },
      { id: 'm14', name: '通用人工智能', description: '展望AGI的诞生，探讨系统如何在多领域展现出类人水平的学习与推理能力。' },
      { id: 'm15', name: '量子计算协同', description: '探索量子比特如何为大模型训练提供指数级增长的算力支撑。' },
      { id: 'm16', name: '人机共生', description: '研究脑机接口与穿戴设备，探索人类与AI深度融合的进化可能性。' },
      { id: 'm4-extra', name: '神经形态计算', description: '模仿生物大脑的物理结构开发芯片，实现极低能耗的高性能智能计算。' }
    ]
  }
];
