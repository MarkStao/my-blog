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
    text: "快速访问",
    icon: "lightbulb",
    prefix: "bookmark/",
    link: "bookmark/"
  },
  {
    text: "个人介绍",
    icon: "lightbulb",
    prefix: "",
    link: "intro"
  }
]);
