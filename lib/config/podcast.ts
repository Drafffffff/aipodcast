/**
 * 播客生成相关配置常量
 */

/**
 * 播客脚本生成提示词
 */
export const SCRIPT_PROMPT = `你是一位专业的中文播客文字脚本撰稿人。现在请你根据提供的原始资料，生成一段模拟两位中文播客主持人之间的自然对话脚本。该脚本应符合以下具体要求：
    一、语言风格
    - 使用较为自然、随意、轻松的日常中文表达；
    - 优先采用简单易懂的词汇，避免书面用语，将书面表达转换为符合口语表达的形式，但不改变专业词汇的内容；
    - 可适度加入网络流行语、俗语、俚语，增强真实感；
    - 符合两位中文播客主持人对话的感觉。

    二、句式结构
    - 使用松散、自然的句式，允许存在口语特征如重复、停顿、语气词等；
    - 鼓励使用叠词（如"特别特别"、"慢慢来"）和填充词（如"这个"、"其实"、"然后"、"就是"、"呃"等）；
    - 可适度插入模糊表达、略带情绪的语调，增强亲和力。

    三、对话结构
    - 两个说话人交替发言，并使用[S1]和[S2]标记两位说话人轮次，[S1]和[S2]中间不加入换行；
    - 每当一方讲话时，另一方可以适当插入自然、简短的反馈或承接语（如"嗯。""对。""是的。""确实。""原来是这样。"等），展现倾听状态；
    - 由其中一个人主讲，另一个做补充，并积极的参与讨论；
    - 对话应有开头引入、核心讨论与自然结尾，语气上有节奏起伏，避免平铺直叙；
    - 总长度控制在10分钟以内的语音朗读时长（不超过1500字），禁止超时。

    四、标点与格式
    - 仅使用中文标点：逗号、句号、问号；
    - 不能没有标点符号；
    - 禁止使用叹号。禁止使用省略号（'...'）、括号、引号（包括''""'"）或波折号等特殊符号；
    - 所有数字转换为中文表达，如"1000000"修改为"一百万"；
    - 请根据上下文，智慧地判断数字的读音，所有带数字的英文缩写要意译，如"a2b"输出为"a到b"、"gpt-4o"输出为"GPT四O"、"3:4"输出为"3比4"，"2021"如果表达年份，应当转换为"二零二一"，但如果表示数字，应当转换为"两千零二十一"。请保证不要简单转换为中文数字，而是根据上下文，将其翻译成合适的中文。

    五、内容要求
    - 所有内容都基于原始资料改写，不得照搬其书面表达，原始资料中所有的内容都要完整的提到，不能丢失或者省略信息；
    - 可加入适当的背景说明、吐槽、对比、联想、提问等方式，增强对话的节奏和趣味性；
    - 确保信息密度较高，引用需确保上下文完整，确保听众能理解；
    - 在对话内不要输出"我是谁"，"我是S1"，"我是S2"等相关内容；
    - 如有专业术语则需要提供解释的解释，如果涉及抽象技术点，可以使用比喻类比等方式解释，避免听起来晦涩难懂。

    请根据以上要求和提供的原始资料，将其转化为符合以上所有要求的播客对话脚本。一定要用[S1]和[S2]标记两位说话人，绝对不能使用任何其它符号标记说话人。
    注意：直接输出结果，不要包含任何额外信息。`

/**
 * 播客主持人1音频提示
 */
export const PROMPT_AUDIO_SPEAKER1 = 'https://autolayout.oss-cn-beijing.aliyuncs.com/tts/zh_spk1_moon.wav?OSSAccessKeyId=LTAI5t8AyMKpMrXtvsvNoo8d&Expires=5355966314&Signature=9PlY0l2ZAxFLshHo48TftKrUcwY%3D'

/**
 * 播客主持人1文本提示
 */
export const PROMPT_TEXT_SPEAKER1 = '周一到周五，每天早晨七点半到九点半的直播片段。言下之意呢，就是废话有点多，大家也别嫌弃，因为这都是直播间最真实的状态了。'

/**
 * 播客主持人2音频提示
 */
export const PROMPT_AUDIO_SPEAKER2 = 'https://autolayout.oss-cn-beijing.aliyuncs.com/tts/zh_spk2_moon.wav?OSSAccessKeyId=LTAI5t8AyMKpMrXtvsvNoo8d&Expires=5355966325&Signature=91gY%2BxxhuHcuBbZGXhypomESrcU%3D'

/**
 * 播客主持人2文本提示
 */
export const PROMPT_TEXT_SPEAKER2 = '如果大家想听到更丰富更及时的直播内容，记得在周一到周五准时进入直播间，和大家一起畅聊新消费新科技新趋势。'

/**
 * 播客生成默认配置
 */
export const DEFAULT_PODCAST_CONFIG = {
  scriptPrompt: SCRIPT_PROMPT,
  speaker1: {
    audio: PROMPT_AUDIO_SPEAKER1,
    text: PROMPT_TEXT_SPEAKER1,
  },
  speaker2: {
    audio: PROMPT_AUDIO_SPEAKER2,
    text: PROMPT_TEXT_SPEAKER2,
  },
} as const

/**
 * 任务状态常量
 */
export const TASK_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  DONE: 'done', // 向后兼容
} as const

/**
 * 任务类型常量
 */
export const TASK_TYPE = {
  TTSD: 'ttsd',
} as const

/**
 * 播客生成相关的消息文本
 */
export const MESSAGES = {
  SUCCESS: {
    TASK_SUBMITTED: (taskId: string) => 
      `任务已提交成功！任务ID：${taskId}。预计生成时间：3-5分钟，请前往任务列表查看处理进度和结果。`,
  },
  ERROR: {
    INVALID_URL: '请输入有效的 URL',
    TASK_CREATION_FAILED: '创建任务失败',
    TASK_ID_NOT_FOUND: '任务创建失败：未获取到任务ID',
    QUEUE_SUBMISSION_FAILED: '提交队列失败',
    SUBMIT_FAILED: '提交失败',
  },
  INFO: {
    PROCESSING_TIME: '⏱️ 处理时间提醒：播客生成通常需要 3-5 分钟，请耐心等待。您可以在任务列表中实时查看处理进度。',
    QUEUE_INFO: '仅会将上方 URL 发送到队列，其余参数使用默认值并投递到 moss_ttsd 频道。',
  },
  STATUS_DISPLAY: {
    [TASK_STATUS.PENDING]: '处理中',
    [TASK_STATUS.PROCESSING]: '处理中',
    [TASK_STATUS.DONE]: '已完成',
    [TASK_STATUS.COMPLETED]: '已完成',
    [TASK_STATUS.FAILED]: '已失败',
  }
} as const

/**
 * 获取任务状态显示文本
 */
export function getStatusDisplayText(status: string): string {
  return MESSAGES.STATUS_DISPLAY[status as keyof typeof MESSAGES.STATUS_DISPLAY] || status
}
