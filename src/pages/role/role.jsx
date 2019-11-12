import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { connect } from "react-redux";

import { PAGE_SIZE } from "../../config/constantConfig";
import { getRoleList, addRole, updateRole } from "../../api";
import { formateDate } from "../../utils/dateUtils";
import { resetUser } from "../../redux/actions";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
class Role extends Component {
  state = {
    roles: [], // 数据源
    role: {}, // 选择中的用户
    modalVisible: 0 // 0关闭,1显示添加角色 2 显示授权
  };

  /**
   * 可以使用 React.createRef(); 获得子组件对象
   * 但是无法使用这个方法获得 二次包装 的组件对象
   */
  constructor(props) {
    super(props);
    this.authForm = React.createRef();
  }

  // 表格行选中事件
  onRow = role => {
    return {
      onClick: event => {
        this.setState({
          role
        });
      }
    };
  };

  // 异步获得 角色列表
  getRoleList = async () => {
    const response = await getRoleList();
    if (response && response.status === 0) {
      const roles = response.data;
      this.setState({
        roles
      });
    }
  };

  /**
   * 无法使用 refs 获得 addForm 对象
   * 使用 子组件调用父组件方法,传递 函数 给 子组件的props 对象
   * 从而在子组件中进行调用设置form 对象
   */
  setForm = form => {
    this.form = form;
  };

  // 添加角色
  addRole = () => {
    this.form.validateFields(async (error, value) => {
      if (!error) {
        const { name } = value;
        const response = await addRole(name);
        if (response && response.status === 0) {
          message.success("添加成功");
          // 不发送请求，直接更新缓存数据 this.getRoleList();
          /**
           * 不建议直接修改state 属性
           *  const { roles } = this.state;
           * roles.push(response.data);
           */

          /**
           * 更新的数据如果于原数据没有关系，则使用 this.setstate({roles})
           * 更新的数据如果基于原数据进行操作，则使用函数更新方法，如下
           */
          this.setState(state => ({ roles: [...state.roles, response.data] }));

          this.form.resetFields(); //清空表单输入
        } else {
          message.success("添加失败");
        }
        this.onCancel();
      } else {
        message.error("验证失败");
      }
    });
  };

  // 授权角色
  authRole = async () => {
    const { user } = this.props;
    const { id } = this.state.role;
    const authForm = this.authForm.current;
    const role = this.state.role;
    const param = {
      menus: authForm.getMenus(),
      id,
      auth_name: user.username,
      auth_time: Date.now()
    };

    Object.assign(role, param);

    const response = await updateRole(role);

    if (response && response.status === 0) {
      if (role.id === user.role_id) {
        // 如果修改的权限是用户当前的权限需要重新登陆，刷新菜单栏
        message.success("当前用户角色权限成功,请重新登陆");
        this.props.resetUser();
      } else {
        message.success("更新角色权限成功");
        this.setState({
          roles: [...this.state.roles]
        });
        // 需要更新 roles 列表
        this.onCancel();
      }
    } else {
      message.error("更新角色权限失败");
    }
  };

  onCancel = () => {
    if (this.form) {
      this.form.resetFields();
    }

    this.setState({
      modalVisible: 0
    });
  };

  // 初始化异步数据
  componentDidMount() {
    this.getRoleList();
  }

  // 初始化同步数据
  UNSAFE_componentWillMount() {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: formateDate // 简化写法，如果传入参数和函数使用的参数一致，则可以优化写法
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate
      },
      {
        title: "授权人",
        dataIndex: "auth_name"
      }
    ];
  }

  render() {
    const { role, roles } = this.state;
    const title = (
      <div>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ modalVisible: 1 });
          }}
        >
          创建角色
        </Button>
        <Button
          type="primary"
          disabled={!role.id}
          style={{ marginLeft: 10 }}
          onClick={() => {
            this.setState({ modalVisible: 2 });
          }}
        >
          创建角色权限
        </Button>
      </div>
    );

    return (
      <Card title={title}>
        <Modal
          title="添加角色"
          visible={this.state.modalVisible === 1}
          onOk={this.addRole}
          onCancel={this.onCancel}
          okText="确认"
          cancelText="取消"
        >
          <AddForm setForm={this.setForm} />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={this.state.modalVisible === 2}
          onOk={this.authRole}
          onCancel={this.onCancel}
          okText="确认"
          cancelText="取消"
        >
          <AuthForm role={role} ref={this.authForm} />
        </Modal>
        <Table
          pagination={{ pageSize: PAGE_SIZE }}
          dataSource={roles}
          rowKey="id"
          columns={this.columns}
          bordered={true}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role.id],
            onSelect: record =>
              this.setState({
                role: record
              })
          }}
          onRow={this.onRow}
        />
      </Card>
    );
  }
}

export default connect(state => ({ user: state.user }), { resetUser })(Role);
