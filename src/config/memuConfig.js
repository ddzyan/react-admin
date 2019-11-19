const menuList = [
  {
    title: "首页", // 菜单标题名称
    key: "/home", // 对应的path
    icon: "home", // 图标名称
    isPublic: true // 公开的
  },
  {
    title: "币链管理",
    key: "/chain",
    icon: "property-safety"
  },
  {
    title: "账号管理",
    key: "/account",
    icon: "account-book"
  },

  {
    title: "用户管理",
    key: "/user",
    icon: "user"
  },
  {
    title: "角色管理",
    key: "/role",
    icon: "safety"
  },

  {
    title: "图形图表",
    key: "/charts",
    icon: "area-chart",
    children: [
      {
        title: "柱形图",
        key: "/charts/bar",
        icon: "bar-chart"
      },
      {
        title: "折线图",
        key: "/charts/line",
        icon: "line-chart"
      },
      {
        title: "饼图",
        key: "/charts/pie",
        icon: "pie-chart"
      }
    ]
  },

  {
    title: "订单管理",
    key: "/order",
    icon: "windows"
  }
];

export default menuList;
