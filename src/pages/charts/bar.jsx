import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Button } from "antd"

/**
 * 柱形图组件
 */
class Bar extends Component {
  state = {
    sales: [120, 200, 150, 80, 70, 110, 130],
    stores: [110, 150, 100, 180, 170, 130, 160]
  };

  /**
   * 获取图标配置参数
   */
  getOption = (sales, stores) => {
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {// 分类名称
        type: 'category',
        data: ['毛衣', '裤子', '球衣', '鞋子', '袜子', '内衣', '袜子']
      },
      yAxis: {
        type: 'value'
      },
      series: [{ // 一个对象数据代表着一个柱形图，可以输入2组或者以上数据，则显示多组柱形图
        name: '销量',
        data: sales,
        type: 'bar'// 图形类别
      }, { // 一个对象数据代表着一个柱形图，可以输入2组或者以上数据，则显示多组柱形图
        name: '库存',
        data: stores,
        type: 'bar'// 图形类别
      }]
    };
  }

  /**
   * 更新图标数据
   */
  update = () => {
    this.setState(({ sales, stores }) => (
      {
        sales: sales.map(item => item + 1),
        stores: stores.map(item => item + 10)
      }
    ))

  }

  render () {
    const { stores, sales } = this.state

    return (
      <div>
        <Card >
          <Button type="primary" onClick={this.update}>更新</Button>
        </Card>

        <Card title="柱形图一" >
          <ReactEcharts option={this.getOption(sales, stores)} />
        </Card>
      </div>
    )
  }
}

export default Bar;
