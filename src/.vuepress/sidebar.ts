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
            text: "Vue",
            icon: "",
            prefix: "vue/",
            link:"vue/"
          },
          {
            text: "Java",
            icon: "",
            prefix: "java/",
            link:"java/"
          },
          {
            text: "Linux",
            icon: "",
            prefix: "linux/",
            link:"linux/"
          }
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

        ]
      }
  ],
});
