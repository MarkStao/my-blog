import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "知识文档",
    icon: "book",
    prefix: "article/",
    link: "article/",
    children: [
      {
        text: "理论",
        icon: "",
        prefix: "理论/",
        link: "理论/"
      },
      {
        text: "Web",
        icon: "",
        prefix: "Web/",
        link: "Web/"
      },{
        text: "Java",
        icon: "",
        prefix: "Java/",
        link: "Java/"
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
    text: "快捷导航",
    icon: "share",
    prefix: "navigation/",
    link: "navigation/"
  },
  {
    text: "个人介绍",
    icon: "user",
    prefix: "",
    link: "intro"
  }
]);
