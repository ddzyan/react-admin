import React, { Component } from "react";
import PropsType from "prop-types";
import ReactEcharts from "echarts-for-react";

class Line extends Component {
  static propTypes = {
    chainId: PropsType.number.isRequired
  };

  state = {
    sales: [120, 200, 150, 80, 70, 110, 130],
    stores: [110, 150, 100, 180, 170, 130, 160]
  };

  getOption = (sales, stores) => {
    return {
      title: {
        text: "监控账号余额变化"
      },
      tooltip: {},
      legend: {
        data: ["eosiotest", "eosio"]
      },
      xAxis: {
        // 分类名称
        type: "category",
        data: ["11-1", "11-2", "11-3", "11-4", "11-5", "11-6", "11-7"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          // 一个对象数据代表着一个柱形图，可以输入2组或者以上数据，则显示多组柱形图
          name: "eosiotest",
          data: sales,
          type: "line" // 图形类别
        },
        {
          // 一个对象数据代表着一个柱形图，可以输入2组或者以上数据，则显示多组柱形图
          name: "eosio",
          data: stores,
          type: "line" // 图形类别
        }
      ]
    };
  };

  update = () => {
    this.setState(({ sales, stores }) => ({
      sales: sales.map(item => item + 1),
      stores: stores.map(item => item + 10)
    }));
  };

  render() {
    // 根据传入的chainId,获取对应账号的余额变化情况
    const { stores, sales } = this.state;

    return <ReactEcharts option={this.getOption(sales, stores)} />;
  }
}

export default Line;
