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
        text: "Vue",
        icon: "",
        prefix: "vue/",
        link: "vue/"
      },{
        text: "Java",
        icon: "",
        prefix: "java/",
        link: "java/"
      },{
        text: "Linux",
        icon: "",
        prefix: "linux/",
        link: "linux/"
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
