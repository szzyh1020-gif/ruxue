import { ContentType, SectionContent, Question, GlobalSettings } from './types';

export const DEFAULT_SETTINGS: GlobalSettings = {
  backgroundImageUrl: '', 
  siteTitle: '内蒙古大学 2026级新生入学指南',
  recruitmentUrl: 'https://www.imu.edu.cn/',
  welcomeMessage: '热烈欢迎 2026 级新同学加入内蒙古大学！🎉'
};

export const MOCK_SECTIONS: SectionContent[] = [
  {
    id: '1',
    type: ContentType.WELCOME,
    title: '学长学姐对你们的话',
    description: '来自不同学院的学长学姐，分享他们在内大的成长故事与寄语。',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    lastUpdated: Date.now(),
    chapters: [
      {
        id: 'c1-1',
        title: '致2026级萌新的一封信',
        content: `## 欢迎来到内蒙古大学！\n\n亲爱的2026级学弟学妹们：\n\n你们好！我是来自文学与新闻传播学院的2023级学姐。首先祝贺你们步入大学的殿堂！\n\n内大是一所充满历史底蕴又富有现代活力的学校。在这里，你不仅能感受到“崇尚真知、追求卓越”的校训精神，还能体验到独特的北疆文化。`,
        imageUrl: 'https://picsum.photos/800/400?random=101',
        createdAt: Date.now()
      },
      {
        id: 'c1-2',
        title: '给新生的三点建议',
        content: `**1. 勇于探索**：不要局限于课本，多去图书馆，多参加社团。\n**2. 学会独立**：大学是自我管理的开始，安排好自己的生活和学习。\n**3. 珍惜友谊**：宿舍的室友可能是你未来四年最亲密的伙伴。`,
        imageUrl: 'https://picsum.photos/800/400?random=102',
        createdAt: Date.now() - 10000
      }
    ]
  },
  {
    id: '2',
    type: ContentType.OVERVIEW,
    title: '学校概况',
    description: '了解内蒙古大学的历史沿革、校园风光及校区分布。',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    lastUpdated: Date.now(),
    chapters: [
        {
            id: 'c2-1',
            title: '塞外明珠 —— 内蒙古大学',
            content: `内蒙古大学创建于1957年，是新中国成立后在少数民族地区最早建立的第一所综合大学。\n\n### 学校荣誉\n学校是国家“双一流”建设高校，也是国家“211工程”重点建设高校。`,
            imageUrl: 'https://picsum.photos/800/400?random=201',
            createdAt: Date.now()
        },
        {
            id: 'c2-2',
            title: '校区地图分布',
            content: `### 校区分布\n* **北校区（主校区）**：位于呼和浩特市赛罕区大学西路，交通便利，学术氛围浓厚。\n* **南校区**：位于昭君路，环境优美，设施现代化。`,
            imageUrl: 'https://picsum.photos/800/400?random=202',
            createdAt: Date.now()
        }
    ]
  },
  {
    id: '3',
    type: ContentType.ACADEMICS,
    title: '学业方向',
    description: '各学院专业介绍、选课指南及奖学金政策。',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    lastUpdated: Date.now(),
    chapters: [
        {
            id: 'c3-1',
            title: '主要学科与专业',
            content: `学校涵盖哲学、经济学、法学、教育学、文学、历史学、理学、工学、农学、管理学、艺术学等11大学科门类。`,
            createdAt: Date.now()
        },
        {
            id: 'c3-2',
            title: '选课与奖学金',
            content: `### 选课小贴士\n* 大一新生主要以通识课和学科基础课为主。\n* 选修课（公选课）记得拼手速！推荐《草原文化概论》和《蒙古族民俗》。\n\n### 奖助学金\n* 国家奖学金\n* 校长奖学金\n* 乌兰夫奖学金`,
            createdAt: Date.now()
        }
    ]
  },
  {
    id: '4',
    type: ContentType.LIFE,
    title: '生活指南',
    description: '食宿行游购娱，新生入学必备的生存手册。',
    imageUrl: 'https://picsum.photos/800/400?random=4',
    lastUpdated: Date.now(),
    chapters: [
        {
            id: 'c4-1',
            title: '舌尖上的内大',
            content: `### 食堂攻略\n* **北校区桃李园**：一楼的面食一绝，二楼的风味窗口种类丰富。\n* **南校区清真餐厅**：大盘鸡拌面强烈推荐。`,
            imageUrl: 'https://picsum.photos/800/400?random=401',
            createdAt: Date.now()
        },
        {
            id: 'c4-2',
            title: '住宿与气候',
            content: `### 住宿条件\n本科生通常为4-6人间，上床下桌，配有阳台。记得带好插排和遮光帘哦！\n\n### 气候提醒\n呼和浩特早晚温差大，即使是夏天也要准备一件薄外套。冬天供暖很好，室内穿短袖，出门穿羽绒服。`,
            createdAt: Date.now()
        }
    ]
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    studentName: '萌新小张',
    content: '请问大一新生可以带电脑吗？',
    timestamp: Date.now() - 1000000,
    answer: '可以带电脑。虽然大一上学期课程较多，但查资料、写作业、选课都需要用到电脑。建议入学时或者军训结束后购买。',
    isFeatured: true,
    isAnswered: true,
  },
  {
    id: 'q2',
    studentName: 'FutureCoder',
    content: '学校的图书馆几点开门？需要占座吗？',
    timestamp: Date.now() - 500000,
    answer: '图书馆通常早上7:00开门，晚上10:00闭馆。期末考试周人会比较多，建议早点去，但平时座位比较充足。我们有座位预约系统，不需要物理占座哦。',
    isFeatured: true,
    isAnswered: true,
  },
  {
    id: 'q3',
    studentName: '吃货一枚',
    content: '学校附近有什么好吃的吗？',
    timestamp: Date.now(),
    isFeatured: false,
    isAnswered: false,
  }
];