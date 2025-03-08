import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "知识文档",
      icon: "book",
      prefix: "article",
      link:"article/",
      children: [
        {
          text: "理论",
          icon: "",
          prefix: "理论/",
          link:"理论/"
        },{
          text: "Web",
          icon: "",
          prefix: "Web/",
          link:"Web/"
        },{
          text: "Java",
          icon: "",
          prefix: "Java/",
          link:"Java/"
        },{
          text: "Python",
          icon: "",
          prefix: "Python/",
          link: "Python/"
        },{
          text: "Linux",
          icon: "",
          prefix: "Linux/",
          link: "Linux/"
        },{
          text: "Windows",
          icon: "",
          prefix: "Windows/",
          link: "Windows/"
        },{
          text: "其它",
          icon: "",
          prefix: "其它/",
          link: "其它/"
        },
      ],
    },
    {
        text: "快速导航",
        icon: "share",
        prefix: "navigation/",
        link: "navigation/",
        children: [
            {
                text: "设计",
                icon: "",
                link:"设计"
            },
            {
                text: "开发",
                icon: "",
                link:"开发"
            },
            {
                text: "运维",
                icon: "",
                link:"运维"
            },
            {
                text: "学习",
                icon: "",
                link:"学习"
            },
            {
                text: "下载",
                icon: "",
                link:"下载"
            },
            {
                text: "工具",
                icon: "",
                link:"工具"
            },
        ]
      }
  ],
});
