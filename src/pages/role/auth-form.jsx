import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Tree, Form, Input } from "antd";

import menuList from "../../config/memuConfig";
const { TreeNode } = Tree;
const { Item } = Form;

/**
 * 更新权限组件
 * 使用 PureComponent
 * 避免 由于父组件执行 render ，即使子组件没有state/props的更新也需要进行render 的bug
 * 优化渲染性能
 */
class AuthForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object.isRequired
  };

  /**
   *
   * 初始化显示 checkedKeys
   * 由于父组件关闭modal只是 设置了 disable，组件并未死亡，所以 checkedKeys 将不会进行改变
   * 但是 父组件每次显示 modal ，都会传递一个新的props属性
   * 所以需要结合componentWillReciveProps 进行更新 state 状态
   */
  constructor(props) {
    super(props);
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus
    };
  }

  // 为父组件提供最新 menus 的方法
  getMenus = () => this.state.checkedKeys;

  onCheck = (checkedKeys, info) => {
    this.setState({ checkedKeys });
  };

  getTreeNodes = menuList => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      );
      return pre;
    }, []);
  };
  // 初始化同步数据
  UNSAFE_componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList);
  }

  /**
   * 接收父组件传递的属性，只会在更新的时候调用，初始化需要放到 构造函数中
   * 在此事件中进行 setState ，并不会运行2次render
   * 主要用于以下情况
   * 1. 在组件没有消亡的时候需要进行更新props属性
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { menus } = nextProps.role;
    this.setState({ checkedKeys: menus });
  }

  /**
   * checkable 是否可以选中
   * defaultExpandAll 全部展开
   * checkedKeys={role.menus} 直接赋值将导致按钮无法再次被选中
   *
   */
  render() {
    console.log("auth-form render()");
    const { role } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 } // 右侧包裹的宽度
    };
    return (
      <div>
        <Item label="用户名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          defaultExpandAll={true}
          checkable
          checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    );
  }
}

export default AuthForm;
